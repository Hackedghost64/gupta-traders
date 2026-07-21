const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/inventory.json', 'utf8'));

data[0].image = '/assets/harvester.jpg';
data[1].image = '/assets/flour_mill.jpg';
data[2].image = '/assets/tiller.jpg';
data[3].image = '/assets/tiller.jpg';

fs.writeFileSync('public/data/inventory.json', JSON.stringify(data, null, 2));
console.log('JSON updated successfully');
