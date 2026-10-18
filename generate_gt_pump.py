import os
import math

def generate_gt_pump_svg():
    """
    Generates a crisp, modern vector SVG logo where 'G' and 'T' form an industrial water pump.
    - 'G' forms the circular volute casing and impeller intake of the pump.
    - 'T' forms the vertical discharge neck and horizontal pipe flange / tee manifold.
    - An energetic water droplet and flow wave emerges from the core.
    - Golden wheat ear curves gently along the lower rim.
    """
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <!-- Gradients -->
    <linearGradient id="pumpGradG" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="50%" stop-color="#059669" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>

    <linearGradient id="pipeGradT" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="50%" stop-color="#0EA5E9" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>

    <linearGradient id="waterGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>

    <linearGradient id="goldAccent" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#FBBF24" />
    </linearGradient>

    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Background Circle (Optional subtle backing) -->
  <circle cx="250" cy="250" r="230" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />

  <g filter="url(#dropShadow)" transform="translate(10, 5)">
    <!-- ============================================== -->
    <!-- MOTOR COOLING FINS (Left side of Pump Motor)   -->
    <!-- ============================================== -->
    <g opacity="0.85">
      <rect x="75" y="220" width="22" height="100" rx="6" fill="#047857" />
      <rect x="105" y="200" width="18" height="140" rx="6" fill="#059669" />
      <rect x="130" y="190" width="18" height="160" rx="6" fill="#10B981" />
      <!-- Base Mount Plate -->
      <path d="M 90 380 L 370 380 Q 380 380 380 395 L 80 395 Q 80 380 90 380 Z" fill="#334155" />
      <rect x="120" y="360" width="220" height="20" rx="4" fill="#475569" />
    </g>

    <!-- ============================================== -->
    <!-- 'G' - PUMP VOLUTE CASING & SPIRAL CHAMBER      -->
    <!-- ============================================== -->
    <!-- The outer spiral body of the pump forming a bold 'G' -->
    <!-- Outer arc from top discharge (x:270, y:150) around through bottom to right bar -->
    <path d="
      M 255 150
      A 115 115 0 1 0 355 300
      L 355 255
      L 260 255
      A 25 25 0 0 1 260 205
      L 355 205
      A 45 45 0 0 1 400 250
      L 400 300
      A 160 160 0 1 1 255 105
      Z
    " fill="url(#pumpGradG)" />

    <!-- Impeller Eye / Water Swirl inside the G center -->
    <circle cx="250" cy="270" r="32" fill="#ffffff" />
    <!-- 4 Impeller curved blades -->
    <path d="M 250 250 Q 262 260 250 270 Q 238 260 250 250 Z" fill="url(#waterGlow)" />
    <path d="M 270 270 Q 260 282 250 270 Q 260 258 270 270 Z" fill="url(#waterGlow)" />
    <path d="M 250 290 Q 238 280 250 270 Q 262 280 250 290 Z" fill="url(#waterGlow)" />
    <path d="M 230 270 Q 240 258 250 270 Q 240 282 230 270 Z" fill="url(#waterGlow)" />
    <!-- Center brass hub -->
    <circle cx="250" cy="270" r="10" fill="url(#goldAccent)" />

    <!-- ============================================== -->
    <!-- 'T' - DISCHARGE RISER PIPE & FLANGE / TEE VALVE -->
    <!-- ============================================== -->
    <!-- The vertical column rises directly from the pump discharge -->
    <!-- Flange connection bolts at pump outlet -->
    <rect x="235" y="142" width="60" height="12" rx="3" fill="#0284C7" />
    
    <!-- T - Vertical Stem (Pump Discharge Neck) -->
    <rect x="245" y="65" width="40" height="85" rx="5" fill="url(#pipeGradT)" />
    
    <!-- T - Horizontal Crossbar (Pipe Manifold / Tee Joint / Flange) -->
    <path d="
      M 175 60
      Q 175 45 190 45
      L 340 45
      Q 355 45 355 60
      L 355 90
      Q 355 98 345 98
      L 295 98
      L 295 102
      L 235 102
      L 235 98
      L 185 98
      Q 175 98 175 90
      Z
    " fill="url(#pipeGradT)" />

    <!-- Flange pipe lips on left and right of the T -->
    <rect x="170" y="50" width="10" height="42" rx="3" fill="#0369A1" />
    <rect x="350" y="50" width="10" height="42" rx="3" fill="#0369A1" />

    <!-- High-pressure Water Jet & Droplets emerging from T pipe -->
    <path d="M 365 71 C 390 68 410 75 425 65 C 415 80 395 82 365 75 Z" fill="url(#waterGlow)" opacity="0.9" />
    <!-- Water droplets -->
    <circle cx="438" cy="62" r="7" fill="#38BDF8" />
    <circle cx="455" cy="74" r="5" fill="#0EA5E9" />
    <circle cx="420" cy="92" r="4" fill="#0284C7" />

    <!-- ============================================== -->
    <!-- AGRICULTURAL WHEAT EAR EMBRACING THE PUMP      -->
    <!-- ============================================== -->
    <g transform="translate(10, 0)">
      <!-- Wheat stem -->
      <path d="M 120 375 C 80 310 85 220 120 160" fill="none" stroke="url(#goldAccent)" stroke-width="4" stroke-linecap="round" />
      <!-- Grains -->
      <path d="M 116 165 Q 98 152 110 140 Q 124 152 116 165 Z" fill="url(#goldAccent)" />
      <path d="M 125 178 Q 140 165 145 180 Q 132 190 125 178 Z" fill="url(#goldAccent)" />
      <path d="M 103 195 Q 82 185 96 172 Q 110 183 103 195 Z" fill="url(#goldAccent)" />
      <path d="M 112 212 Q 130 200 132 218 Q 118 226 112 212 Z" fill="url(#goldAccent)" />
      <path d="M 94 235 Q 72 228 84 212 Q 100 222 94 235 Z" fill="url(#goldAccent)" />
      <path d="M 101 254 Q 122 244 122 262 Q 108 268 101 254 Z" fill="url(#goldAccent)" />
      <path d="M 88 280 Q 66 275 78 258 Q 94 266 88 280 Z" fill="url(#goldAccent)" />
      <path d="M 96 300 Q 116 292 114 310 Q 100 314 96 300 Z" fill="url(#goldAccent)" />
      <path d="M 88 328 Q 68 324 76 308 Q 92 314 88 328 Z" fill="url(#goldAccent)" />
    </g>
  </g>
</svg>'''
    
    output_path = "/home/divyam/Downloads/projects/gupta-traders/public/assets/gt_pump_logo.svg"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"Generated {output_path}")

if __name__ == "__main__":
    generate_gt_pump_svg()
