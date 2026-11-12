# saga00-design (Pepe Comala Catalogue)

**Repo:** saga00-design/saga00-design  
**Inspected:** 2026-11-12  
**Status:** Active — deployed to GitHub Pages

## What It Is
The official Pepe Comala brand product catalogue — a React 19 app showcasing artisanal Mexican food products (salsas, adobos, pastes). Features an independent scrolling column layout, a floating settings sidebar for real-time theme/layout control, product detail modals, and Gemini AI-powered description enhancement.

This is the **saga00-design** org's special repo — it also functions as the GitHub org profile.

## Tech Stack
- React 19 + TypeScript + Vite 6
- @google/genai (Gemini) for AI description enhancement
- lucide-react for icons
- Tailwind CSS (dark theme — `bg-dark`)
- GitHub Pages deployment (auto on push to main)

## File Structure
```
App.tsx                   Root — column layout, theme editor sidebar, product state
constants.ts              INITIAL_PRODUCTS (real Pepe Comala items), DEFAULT_THEME
types.ts                  Product, ThemeConfig, AIState
services/
  geminiService.ts        AI description enhancement via Gemini
components/
  ProductCard.tsx         Column card — image, title, price, category, tags
  ProductModal.tsx        Detail modal — view + AI enhance button + edit
.github/workflows/
  static.yml              GitHub Pages deploy on push to main
```

## Products (from constants.ts)
Real Pepe Comala artisanal Mexican products (Spanish descriptions):
- Salsa Habanero — ardiente habanero mix, perfect for adding heat
- Salsa Macha — oil-rich salsa with dried chiles and seeds
- Pastor — authentic Al Pastor adobo
- Adobo — traditional Mexican adobo paste (smoked, slow-cook)
- Salsa de Tomatillo Verde — fresh green tomatillo salsa
- Base para Barbacoa — barbacoa base
- (additional products in constants.ts)

Each product: `{ id, title, description, price, imageUrl, category, tags }`

## ThemeConfig
```ts
{
  columnCount: number    // user-adjustable 1–5; auto-capped by screen width
  gap: number            // spacing between columns
  primaryColor: string   // accent color (hex)
  titleFont: 'sans' | 'serif'
}
```

## Column Layout Logic (App.tsx)
Responsive column count:
- < 640px → 1 column (always)
- 640–1024px → max 2 columns
- 1024–1440px → max 3 columns
- > 1440px → user's columnCount setting (up to 5)

Products distributed round-robin: `cols[index % effectiveColumns].push(product)`

## AI Enhancement (geminiService.ts)
Takes a product and sends to Gemini with a prompt to improve/enhance the Spanish description. Result updates the product's description field in state.

## Deployment
`.github/workflows/static.yml` deploys the whole repository to GitHub Pages on push to `main`. The Vite build must run first — the workflow may need updating to run `npm ci && npm run build` and deploy the `dist/` folder rather than the repo root.

**Risk**: The current workflow uploads `path: '.'` (the entire repo), not the built `dist/` — this would serve raw source files, not the built app. Should be:
```yaml
- run: npm ci && npm run build
- uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'
```

## Env Vars
```
GEMINI_API_KEY=   # Required for AI description enhancement
```

## Notes
- Spanish-language product names and descriptions
- No backend — all product data in constants.ts
- No auth, no cart, no checkout — this is a showcase/catalogue only
- Related: Pepe-Comala (Backbone Hub landing page — different product)
- Related: Pepe-Comala-Catalogue (generic product catalogue prototype, different from this)
