# Memory

## Me
Elliott — saga00-design is the Pepe Comala product catalogue — Mexican artisanal food products.

## This Repo
React 19 product showcase for Pepe Comala brand — artisanal Mexican salsas, adobos, and pastes. Features independent scrolling columns, a live theme/layout editor sidebar, and Gemini AI-powered product description enhancement. Deployed to GitHub Pages via CI/CD.

→ Full details: memory/projects/saga00-design.md

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript + Vite 6 |
| AI | @google/genai (Gemini) — product description enhancement |
| Icons | lucide-react |
| Styling | Tailwind CSS (dark theme) |
| Deploy | GitHub Pages via `.github/workflows/static.yml` |

## Key Files
| File | Purpose |
|------|---------|
| `App.tsx` | Root — columns, theme state, product CRUD |
| `constants.ts` | `INITIAL_PRODUCTS` (real Pepe Comala products), `DEFAULT_THEME` |
| `types.ts` | `Product`, `ThemeConfig`, `AIState` |
| `components/ProductCard.tsx` | Product card in masonry column |
| `components/ProductModal.tsx` | Detail modal with AI enhance button |
| `services/geminiService.ts` | Gemini prompt → enhanced description |

## Product Type
```ts
interface Product {
  id: string; title: string; description: string; price: number
  imageUrl: string; category: string; tags: string[]
}
```

## Theme Config
```ts
interface ThemeConfig {
  columnCount: number    // 1–5 (responsive: capped at 1/2/3 on small screens)
  gap: number
  primaryColor: string
  titleFont: 'sans' | 'serif'
}
```

## Dev Command
```bash
npm run dev
```

## Deployment
Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/static.yml`.

## Notes
- Products are real Pepe Comala items: Salsa Habanero, Salsa Macha, Pastor, Adobo, Salsa de Tomatillo Verde, Barbacoa base, etc.
- Spanish-language product descriptions
- Gemini API key required (env var `GEMINI_API_KEY` in `.env.local`)
- No auth, no backend — products defined in constants.ts
- Independent scrolling columns: products distributed round-robin across N columns

## Preferences
- Direct, practical answers
- Complete code when making changes
- Point out risks before acting
- Small business → scalable thinking
