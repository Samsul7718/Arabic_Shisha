import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shishaDataPath = path.resolve(__dirname, 'src/data/shishaData.js');

/**
 * Vite Dev Server Middleware Plugin
 * Automatically saves new products added from the Admin panel directly into src/data/shishaData.js on disk.
 */
function shishaDataSyncPlugin() {
  return {
    name: 'shishadata-sync-plugin',
    configureServer(server) {
      // Endpoint 1: Add a single new product directly to shishaData.js
      server.middlewares.use('/api/save-product', (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const product = JSON.parse(body);
            if (!product || !product.nameEn) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'Product name is required' }));
            }

            let fileContent = fs.readFileSync(shishaDataPath, 'utf-8');

            const isRental = product.category === 'rentals' || (product.id && product.id.startsWith('rent_'));
            const targetArrayHeader = isRental ? 'export const RENTAL_POT_MODELS = [' : 'export const SHISHA_ITEMS = [';

            const headerIndex = fileContent.indexOf(targetArrayHeader);
            if (headerIndex === -1) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'Target array not found in shishaData.js' }));
            }

            const itemCode = `  {
    id: ${JSON.stringify(product.id || (isRental ? `rent_${Date.now()}` : `item_${Date.now()}`))},
    category: ${JSON.stringify(product.category || (isRental ? 'rentals' : 'flavors'))},
    brand: ${JSON.stringify(product.brand || 'Afzal')},
    nameEn: ${JSON.stringify(product.nameEn || '')},
    nameAr: ${JSON.stringify(product.nameAr || product.nameEn || '')},
    descriptionEn: ${JSON.stringify(product.descriptionEn || 'Original premium product.')},
    descriptionAr: ${JSON.stringify(product.descriptionAr || 'منتج أصلي فاخر.')},
    price: ${Number(product.price || product.dailyRate) || 100},
    rating: ${Number(product.rating) || 5.0},
    stockStatus: ${JSON.stringify(product.stockStatus || 'in_stock')},
    stockQty: ${Number(product.stockQty) || 20},
    strength: ${JSON.stringify(product.strength || 'Medium')},
    profile: ${JSON.stringify(product.profile || 'Fruity & Sweet')},
    badge: ${JSON.stringify(product.badge || 'New Arrival')},
    image: ${JSON.stringify(product.image || '')},
    secondaryImage: ${JSON.stringify(product.secondaryImage || '')}
  },`;

            const insertPosition = headerIndex + targetArrayHeader.length;
            const updatedContent = fileContent.slice(0, insertPosition) + '\n' + itemCode + fileContent.slice(insertPosition);

            fs.writeFileSync(shishaDataPath, updatedContent, 'utf-8');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true, message: 'Product automatically added to shishaData.js!' }));
          } catch (err) {
            console.error('Error saving product to shishaData.js:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });

      // Endpoint 2: Sync all items (or save full updated array) to shishaData.js
      server.middlewares.use('/api/sync-all-to-shishadata', (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const { items } = JSON.parse(body);
            if (!Array.isArray(items)) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'Items array is required' }));
            }

            let fileContent = fs.readFileSync(shishaDataPath, 'utf-8');

            const startTag = 'export const SHISHA_ITEMS = [';
            const startIndex = fileContent.indexOf(startTag);
            if (startIndex === -1) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'SHISHA_ITEMS array not found in shishaData.js' }));
            }

            let depth = 0;
            let endIndex = -1;
            for (let i = startIndex + startTag.length - 1; i < fileContent.length; i++) {
              if (fileContent[i] === '[') depth++;
              else if (fileContent[i] === ']') {
                depth--;
                if (depth === 0) {
                  endIndex = i;
                  break;
                }
              }
            }

            if (endIndex === -1) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'Could not find closing bracket of SHISHA_ITEMS' }));
            }

            const formattedItemsCode = items
              .map(
                (item) => `  {
    id: ${JSON.stringify(item.id)},
    category: ${JSON.stringify(item.category || 'flavors')},
    brand: ${JSON.stringify(item.brand || 'Afzal')},
    nameEn: ${JSON.stringify(item.nameEn || '')},
    nameAr: ${JSON.stringify(item.nameAr || item.nameEn || '')},
    descriptionEn: ${JSON.stringify(item.descriptionEn || '')},
    descriptionAr: ${JSON.stringify(item.descriptionAr || '')},
    price: ${Number(item.price) || 0},
    rating: ${Number(item.rating) || 5.0},
    stockStatus: ${JSON.stringify(item.stockStatus || 'in_stock')},
    stockQty: ${Number(item.stockQty) || 0},
    strength: ${JSON.stringify(item.strength || 'Medium')},
    profile: ${JSON.stringify(item.profile || 'Fruity & Sweet')},
    badge: ${JSON.stringify(item.badge || 'New Arrival')},
    image: ${JSON.stringify(item.image || '')},
    secondaryImage: ${JSON.stringify(item.secondaryImage || '')}
  }`
              )
              .join(',\n');

            const updatedContent =
              fileContent.slice(0, startIndex + startTag.length) + '\n' + formattedItemsCode + '\n' + fileContent.slice(endIndex);

            fs.writeFileSync(shishaDataPath, updatedContent, 'utf-8');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(
              JSON.stringify({
                success: true,
                count: items.length,
                message: 'shishaData.js successfully updated on disk!'
              })
            );
          } catch (err) {
            console.error('Error syncing shishaData.js:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), shishaDataSyncPlugin()]
});
