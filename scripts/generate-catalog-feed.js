#!/usr/bin/env node

/**
 * Meta Commerce & WhatsApp Business Catalog Feed Generator
 *
 * Fetches live products from Firestore (staff-app-0037243-id) with graceful
 * fallback to local inventory.json, and produces Meta-compliant:
 *  1. public/whatsapp-catalog.csv (Meta Standard CSV)
 *  2. public/whatsapp-catalog.xml (RSS 2.0 / Google Merchant Feed)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/staff-app-0037243-id/databases/(default)/documents/products?pageSize=100';
const STORE_BASE_URL = 'https://hackedghost64.github.io/gupta-traders/#catalog';
const DEFAULT_BRAND = 'Gupta Traders';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/zkfnbyg6/image/upload/v1788524570/pump_dekho_products/mdn9nx5dzknk8ov3ophm.jpg';

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""').replace(/[\r\n]+/g, ' ').trim();
  return `"${str}"`;
}

function escapeXml(val) {
  if (!val) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchFirestoreProducts() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(FIRESTORE_URL, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`Firestore HTTP error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const documents = data.documents || [];
    if (!Array.isArray(documents) || documents.length === 0) {
      throw new Error('Firestore returned empty documents list');
    }

    const products = [];

    for (const doc of documents) {
      const docId = doc.name ? doc.name.split('/').pop() : '';
      const f = doc.fields || {};

      const name = f.name?.stringValue?.trim() || '';
      if (!name) continue;

      const id = docId || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const brand = f.brand?.stringValue?.trim() || DEFAULT_BRAND;
      const inStock = f.inStock?.booleanValue !== false;
      const availability = inStock ? 'in stock' : 'out of stock';

      let numericPrice = 0;
      if (f.price?.integerValue) numericPrice = Number(f.price.integerValue);
      else if (f.price?.doubleValue) numericPrice = Number(f.price.doubleValue);

      const priceStr = `${numericPrice.toFixed(2)} INR`;

      // Extract images
      let imageUrls = [];
      if (f.imageUrls?.arrayValue?.values) {
        imageUrls = f.imageUrls.arrayValue.values
          .map((v) => v.stringValue || '')
          .filter(Boolean);
      }
      const image_link = imageUrls[0] || DEFAULT_IMAGE;
      const additional_image_link = imageUrls.slice(1).join(',');

      // Format specs into clean text
      let specsText = '';
      if (f.specs?.mapValue?.fields) {
        const specParts = [];
        for (const [k, v] of Object.entries(f.specs.mapValue.fields)) {
          if (v && v.stringValue) {
            specParts.push(`${k}: ${v.stringValue}`);
          }
        }
        if (specParts.length > 0) {
          specsText = `Specs: ${specParts.join(', ')}.`;
        }
      }

      const rawDesc = f.description?.stringValue?.trim() || '';
      const fullDesc = [rawDesc, specsText].filter(Boolean).join(' ') || `${name} by ${brand} available at Gupta Traders.`;

      products.push({
        id,
        title: name.slice(0, 150),
        description: fullDesc.slice(0, 5000),
        availability,
        condition: 'new',
        price: priceStr,
        link: STORE_BASE_URL,
        image_link,
        additional_image_link,
        brand,
        origin_country: 'IN',
      });
    }

    return products;
  } catch (err) {
    clearTimeout(timer);
    console.warn(`[Feed Generator] Could not fetch live Firestore catalog: ${err.message}`);
    return [];
  }
}

function loadLocalInventoryFallback() {
  const localPath = path.join(publicDir, 'data', 'inventory.json');
  if (!fs.existsSync(localPath)) return [];

  try {
    const raw = fs.readFileSync(localPath, 'utf8');
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
      const name = item.nameKey || item.id || 'Product';
      const price = Number(item.price || 0).toFixed(2) + ' INR';
      const specs = Array.isArray(item.specs) ? item.specs.map((s) => s.key).join(', ') : '';
      const desc = specs ? `${name} - ${specs}` : name;

      return {
        id: item.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: name,
        description: desc,
        availability: 'in stock',
        condition: 'new',
        price,
        link: STORE_BASE_URL,
        image_link: item.image || DEFAULT_IMAGE,
        additional_image_link: '',
        brand: DEFAULT_BRAND,
        origin_country: 'IN',
      };
    });
  } catch (e) {
    console.error('[Feed Generator] Failed to parse local inventory fallback', e);
    return [];
  }
}

function generateCsv(products) {
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'additional_image_link',
    'brand',
    'origin_country',
  ];

  const rows = products.map((p) => [
    escapeCsvField(p.id),
    escapeCsvField(p.title),
    escapeCsvField(p.description),
    escapeCsvField(p.availability),
    escapeCsvField(p.condition),
    escapeCsvField(p.price),
    escapeCsvField(p.link),
    escapeCsvField(p.image_link),
    escapeCsvField(p.additional_image_link || ''),
    escapeCsvField(p.brand),
    escapeCsvField(p.origin_country),
  ].join(','));

  return [headers.join(','), ...rows].join('\n') + '\n';
}

function generateXml(products) {
  const itemsXml = products.map((p) => `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title><![CDATA[${p.title}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:link>${escapeXml(p.link)}</g:link>
      <g:image_link>${escapeXml(p.image_link)}</g:image_link>
      ${p.additional_image_link ? `<g:additional_image_link>${escapeXml(p.additional_image_link)}</g:additional_image_link>` : ''}
      <g:brand><![CDATA[${p.brand}]]></g:brand>
      <g:condition>${p.condition}</g:condition>
      <g:availability>${p.availability}</g:availability>
      <g:price>${p.price}</g:price>
      <g:country_of_origin>${p.origin_country}</g:country_of_origin>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Gupta Traders - WhatsApp Business Catalog</title>
    <link>https://hackedghost64.github.io/gupta-traders/</link>
    <description>Product catalog feed for Meta Commerce Manager and WhatsApp Business</description>
${itemsXml}
  </channel>
</rss>
`;
}

async function main() {
  console.log('📦 [WhatsApp Catalog Generator] Starting build...');

  let products = await fetchFirestoreProducts();
  if (products.length === 0) {
    console.log('⚠️ [WhatsApp Catalog Generator] Using local inventory.json fallback');
    products = loadLocalInventoryFallback();
  }

  if (products.length === 0) {
    console.error('❌ [WhatsApp Catalog Generator] No products found to export!');
    process.exit(1);
  }

  console.log(`✓ Found ${products.length} catalog products to convert.`);

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const csvPath = path.join(publicDir, 'whatsapp-catalog.csv');
  const xmlPath = path.join(publicDir, 'whatsapp-catalog.xml');

  fs.writeFileSync(csvPath, generateCsv(products), 'utf8');
  fs.writeFileSync(xmlPath, generateXml(products), 'utf8');

  console.log(`✓ CSV Feed written: ${csvPath} (${fs.statSync(csvPath).size} bytes)`);
  console.log(`✓ XML Feed written: ${xmlPath} (${fs.statSync(xmlPath).size} bytes)`);
  console.log('🚀 [WhatsApp Catalog Generator] Meta catalog feeds ready!');
}

main().catch((err) => {
  console.error('Fatal feed generator error:', err);
  process.exit(1);
});
