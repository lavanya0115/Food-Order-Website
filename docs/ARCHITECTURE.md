# Architecture

## Relationships
`auth.users` owns one profile and one role, and may own many addresses and orders. Categories own products. Products may own images. Orders own immutable order-item snapshots and append-only status history. Admin actions are recorded separately.

## Existing UI preserved
The cream background, warm red/orange gradient, rounded cards, compact hero and Framer Motion hover/entrance treatment are retained. The official logo replaces the generated utensil icon.

## Central rules
`application_settings` stores the minimum and delivery charge. The secure `place_order` RPC re-fetches prices, rejects unavailable products, uses integer cents, enforces the minimum and records immutable snapshots. The `transition_order_status` RPC enforces allowed transitions.

## Files changed from the original project
`package.json`, `vite.config.js`, `vercel.json`, `index.html`, `src/App.jsx`, `src/main.jsx`, `src/index.css` and the public layout/menu/cart components.

## Main files added
Auth/cart contexts, route guards, public/customer/admin/super-admin pages, Supabase client, constants, common states, SQL schema/RLS, seed, storage policies, environment example and test checklist.
