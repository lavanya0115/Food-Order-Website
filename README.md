# RKJ Thondamans Food Ordering Application

Production-oriented React/Vite frontend with Supabase Auth, PostgreSQL, RLS, Storage-ready image paths, server-validated Cash on Delivery orders, Admin fulfilment and Super Admin foundations.

## Catalogue decisions
- Exactly 30 validated purchasable rows are seeded.
- No products were invented to reach 33.
- `Kever Puttu Mayam` and `Kever Puttu` are preserved and flagged with `requires_business_validation=true`.
- STAR items use `ready_to_eat=true` and `frozen_available=false`.
- Non-STAR items use `frozen_available=NULL` pending confirmation.
- Monetary values are stored in integer SGD cents.

## Local setup
1. Install Node.js 22 LTS or a compatible newer version.
2. Run `npm install`.
3. Create `.env.local` from `.env.example`.
4. Create a Supabase project.
5. Run `supabase/migrations/001_schema_rls.sql` in the SQL editor.
6. Run `supabase/seed/001_products.sql`.
7. Run `supabase/storage_policies.sql`.
8. Register the owner account through the app, then carefully edit and run `supabase/bootstrap_super_admin.sql`.
9. Run `npm run dev`.
10. Verify with `npm run build`.

## Frontend environment variables
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are safe for the browser when RLS is correctly enabled. Never place a service-role key in Vite variables, source code or Vercel browser environment variables.

## Roles
Public sign-up always creates `customer`. Admin and Super Admin roles are assigned only through privileged SQL/server operations. Route guards improve UX, while RLS and security-definer functions enforce security.

## Order workflow
Pending -> Confirmed -> Preparing -> Out for Delivery -> Delivered. Authorised cancellation is recorded separately. Every accepted transition writes history and an activity log.

## Vercel
- Build command: `npm run build`
- Output directory: `dist`
- Add both Vite Supabase variables in Project Settings > Environment Variables.
- `vercel.json` provides SPA rewrites for nested route refreshes.
- Add local and production URLs to Supabase Auth URL Configuration, including `/reset-password`.

## Validation checklist
### Customer
Registration, confirmation, login, logout, reset password, product search, category filters, STAR display, frozen unknown display, basket persistence, $50 minimum, address ownership, COD-only checkout, duplicate submission prevention, own-order RLS, tracking and mobile layout.
### Admin
Role guard, order list, valid status progression, invalid transition rejection, cancellation reason, payment collection policy, availability update policy and Super Admin route denial.
### Super Admin
Dashboard value versus collected COD separation, catalogue CRUD, archive/restore, category management, account management, settings, activity log and RLS enforcement.
### Production
Nested-route refresh, missing images, slow network, expired session, database failure, browser navigation, keyboard focus and responsive layout.

## Important production hardening
The SQL gives a secure baseline. For higher-volume reporting, add paginated RPCs/materialised views. Product image upload UI and advanced account-management forms should call secured server functions; do not expose service-role operations in the browser.
