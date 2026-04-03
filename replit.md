# Rosie: Marketing Website

### Overview

Promotional/marketing website for Rosie by CurlyBraces.ai. Originally built in Next.js and deployed on Railway, now running on Replit.

### Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + custom global CSS (no Tailwind utilities in JSX; all class-based in `globals.css`)
- **Language**: TypeScript
- **Runtime**: Node.js 20

### Project Structure

- `app/page.tsx`: Main page entry point (single-page layout)
- `app/layout.tsx`: Root layout + metadata
- `app/globals.css`: Global styles (all custom CSS: nav, hero, sections, tiles, pricing cards, trust, CTA)
- `app/components/RosieIcons.tsx`: ~28 named solid-fill SVG icon components used throughout the page
- `next.config.js`: Next.js configuration
- `tailwind.config.js`: Tailwind configuration

### Design Tokens

- **Brand coral**: `#E55535`
- **Navy**: `#1E293B`
- **Hero gradient**: `linear-gradient(160deg, #070f1d 0%, #0d1f3c 40%, #132848 75%, #1a3055 100%)` with coral radial glow `::before`
- **Section backgrounds**: `section-bg-violet`, `section-bg-sky`, `section-bg-coral`, `section-bg-emerald`
- **Tile color variants**: `tile-coral`, `tile-violet`, `tile-sky`, `tile-amber`, `tile-emerald`, `tile-navy`, `tile-rose`

### Icons

All tile icons (`.tile-icon`) and badge icons (`.icon-badge-tile`) use **Solid Filled SVG** components from `app/components/RosieIcons.tsx`. These are white SVG strokes/fills on colored tile backgrounds. No emoji are used.

### Pricing

- **Free** ($0, always): gray/neutral accent, "Forever" infinity badge
- **Pro** ($19/seat/month, "Live in beta"): coral accent, "Live in beta" checkmark badge
- **Pro+** ($29/seat/month, "Coming soon"): violet accent, "Coming soon" clock badge

### Running

- Dev server: `npm run dev` on port 5000
- Workflow: "Start application"

### GitHub

Remote: `https://github.com/CurlyBracesAI/rosie-ai-assistant.git` (main branch)
Credential helper: `.local/git-cred-helper.sh` (uses `$GITHUB_TOKEN` secret)

### Deployment (Replit)

- Type: Autoscale
- Build: `npm run build`
- Run: `npx next start -p 5000`
- Port mapping: 5000 → 80
