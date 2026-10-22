# RKJ THONDAMANS FOOD PTE LTD

## Food Ordering Platform

A responsive, database-connected food ordering application developed for **RKJ THONDAMANS FOOD PTE LTD**, a manufacturer and distributor of fresh and frozen food.

The platform allows customers to browse the food catalogue, manage their profiles and delivery addresses, add products to a basket, place Cash on Delivery orders, and track order progress. The application also provides protected Admin and Super Admin areas for order fulfilment and application management.

## Technology Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Lucide React icons
- React Hot Toast

### Backend and Cloud Services

- Supabase Authentication
- Supabase PostgreSQL Database
- Supabase Row Level Security
- Supabase Storage

### Deployment

- GitHub for source control
- Vercel for production hosting

## Main Features

### Public Website

- Responsive landing page
- Warm cream, red, and orange visual theme
- Official RKJ Thondamans branding
- Delivery information
- Searchable food catalogue
- Product category filters
- Ready-to-eat and frozen availability indicators
- Mobile-friendly navigation and basket access

### Customer Authentication

- Customer registration
- Secure login
- Persistent authenticated sessions
- Logout
- Forgot-password and reset-password flow
- Protected customer routes

### Customer Profile

- View customer profile
- Update full name and phone number
- Database persistence after refresh
- Success and error toast notifications

### Delivery Addresses

- Add delivery addresses
- Store addresses in Supabase
- Display saved addresses immediately after creation
- Retain addresses after page refresh
- Restrict customers to their own addresses using Row Level Security
- Select a saved address during checkout

### Product Catalogue

The initial catalogue contains **30 validated purchasable product rows** taken from the official business price list.

Catalogue data includes:

- Product name
- Product variant or size
- Weight per piece
- Price per piece
- Pieces per pack
- Calculated pack price
- Category
- STAR indicator
- Ready-to-eat availability
- Frozen availability
- Product availability status
- Display order
- Business-validation flag

No products were invented to reach an expected count of 33.

The following names are preserved exactly as supplied and are marked for future business validation:

- Kever Puttu
- Kever Puttu Mayam

### Product Business Rules

For STAR-marked products:

```text
ready_to_eat = true
frozen_available = false
```

For non-STAR products:

```text
ready_to_eat = false
frozen_available = NULL
```

A `NULL` frozen-availability value means that frozen availability is awaiting business confirmation.

### Shopping Basket

- Add products to the basket
- Increase or decrease quantities
- Remove products
- Persist the basket after refresh
- Display price per piece
- Display pieces per pack
- Calculate line totals in integer cents
- Display subtotal
- Show progress towards the minimum order amount

### Checkout

- Cash on Delivery only
- No online payment gateway
- Saved delivery-address selection
- Contact-phone entry
- Optional delivery instructions
- Order review
- Minimum delivery-order validation
- Duplicate-submission protection
- Server-side price and availability validation

The minimum subtotal required for delivery is currently:

```text
SGD 50.00
```

The value is stored in `application_settings` so that it can be changed later without editing multiple React components.

### Orders

- Unique human-readable order number
- Immutable product and price snapshots
- Customer order history
- Order-detail view
- Order-tracking timeline
- Cash on Delivery payment status
- Cancellation information
- Status-history records

Supported order workflow:

```text
Pending
→ Confirmed
→ Preparing
→ Out for Delivery
→ Delivered
```

The application also supports:

```text
Cancelled
```

### Admin Area

- Protected Admin routes
- Dashboard summary
- View fulfilment orders
- Filter orders by status
- Progress orders through valid workflow stages
- View customer and delivery details
- View Cash on Delivery status
- Update product availability

### Super Admin Area

- Separate protected Super Admin layout
- Order-value and collected-Cash-on-Delivery summaries
- Product-management foundation
- Category-management foundation
- Admin-account-management foundation
- Application-settings foundation
- Activity-log foundation

## Database Structure

The project uses the following Supabase tables:

```text
profiles
user_roles
food_categories
food_items
product_images
delivery_addresses
orders
order_items
order_status_history
admin_activity_logs
application_settings
```

### Important Relationships

- Each authenticated user has a profile.
- Each authenticated user has one securely assigned role.
- Customers can have multiple delivery addresses.
- Food categories contain multiple food items.
- Food items can have multiple image records.
- Customers can have multiple orders.
- Orders contain immutable order-item snapshots.
- Orders contain append-only status-history records.
- Admin actions are recorded in activity logs.

## Security

Supabase Row Level Security is enabled.

### Customer Data Access

Customers can access only their own:

- Profile
- Delivery addresses
- Orders
- Order items
- Order-status history

Customers cannot:

- Assign themselves Admin or Super Admin roles
- Access another customer's information
- Modify protected order fields
- Bypass the minimum-order rule through browser changes
- Access Admin or Super Admin routes and data

### Important Security Rules

- Public registration creates only customer accounts.
- Admin and Super Admin roles must be assigned through an authorised process.
- Role enforcement is handled by database policies and secured functions, not only by React route guards.
- The Supabase service-role key must never be added to frontend code, GitHub, or Vercel browser environment variables.
- Order creation revalidates products and prices in the database.

## Project Structure

```text
src/
├── components/
│   ├── common/
│   ├── layout/
│   └── menu/
├── constants/
├── context/
├── lib/
├── pages/
│   ├── auth/
│   ├── customer/
│   ├── dashboards/
│   └── public/
├── routes/
├── App.jsx
├── index.css
└── main.jsx

public/
└── assets/

supabase/
├── migrations/
│   └── 001_schema_rls.sql
├── seed/
│   └── 001_products.sql
├── bootstrap_super_admin.sql
└── storage_policies.sql
```

## Prerequisites

Install the following before running the project:

- Node.js 22 LTS or a compatible newer version
- npm
- Git
- Visual Studio Code, recommended
- A Supabase account and project

Verify the local installation:

```bash
node -v
npm -v
git --version
```

## Local Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Food-Order-Website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the Environment File

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Do not add `.env.local` to Git.

The `.gitignore` file should include:

```gitignore
node_modules/
dist/
.vite/
.env
.env.local
.vscode/
```

### 4. Start the Development Server

```bash
npm run dev
```

The application normally runs at:

```text
http://localhost:5173
```

## Supabase Setup

Create a Supabase project, preferably in the Singapore region for this application.

Run the SQL files in this order using the Supabase SQL Editor:

### 1. Create Schema, Functions, Indexes, and RLS Policies

```text
supabase/migrations/001_schema_rls.sql
```

### 2. Insert the 30 Validated Products

```text
supabase/seed/001_products.sql
```

### 3. Configure Storage Buckets and Policies

```text
supabase/storage_policies.sql
```

### 4. Create the Initial Super Admin

Register the authorised owner account through the application. Then carefully update and run:

```text
supabase/bootstrap_super_admin.sql
```

Replace the placeholder email with the authorised account email before executing the statement.

## Environment Variables

### Local Development

Store local values in:

```text
.env.local
```

### Vercel

Add the following variables under:

```text
Vercel Project → Settings → Environment Variables
```

Required variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Because the variables use the public `VITE_` prefix, configure them as **Config** values in Vercel, not Secret values.

Apply them to:

- Production
- Preview

After adding or changing environment variables, redeploy the application so Vite can include the values in the production build.

## Production Build

Create a production build:

```bash
npm run build
```

The generated files are placed in:

```text
dist/
```

Preview the production build locally:

```bash
npm run preview
```

The preview normally runs at:

```text
http://localhost:4173
```

## Vercel Deployment

### Build Settings

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

### SPA Routing

The included `vercel.json` routes browser refreshes back to `index.html`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This prevents 404 errors when refreshing routes such as:

```text
/menu
/cart
/profile
/my-orders
/admin/orders
/super-admin/products
```

### Supabase Authentication URLs

After Vercel provides the production URL, configure Supabase:

```text
Supabase → Authentication → URL Configuration
```

Set the Site URL to the production Vercel URL.

Add redirect URLs for both local and production use:

```text
http://localhost:5173
http://localhost:5173/reset-password
https://your-project.vercel.app
https://your-project.vercel.app/reset-password
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Runs the production build locally for validation.

## Quality Assurance Checklist

### Customer

- [ ] Registration works
- [ ] Login works
- [ ] Session is restored after refresh
- [ ] Logout works
- [ ] Profile update persists
- [ ] Profile success and error notifications work
- [ ] Delivery address creation persists
- [ ] Saved addresses remain after refresh
- [ ] Menu products load from Supabase
- [ ] Search and category filters work
- [ ] STAR products display correctly
- [ ] Cart quantities and totals are correct
- [ ] SGD 50 minimum validation works
- [ ] Cash on Delivery is the only payment method
- [ ] Repeat order submission is prevented
- [ ] Customer can view only personal orders
- [ ] Order tracking displays the correct status

### Admin

- [ ] Admin login is protected
- [ ] Incoming orders display correctly
- [ ] Valid order transitions work
- [ ] Invalid order transitions are rejected
- [ ] Delivered orders display correctly
- [ ] Product availability controls work
- [ ] Admin cannot access Super Admin routes

### Super Admin

- [ ] Dashboard values load correctly
- [ ] Total order value is separate from collected Cash on Delivery
- [ ] Products can be managed securely
- [ ] Categories can be managed securely
- [ ] Admin accounts can be managed securely
- [ ] Application settings are protected
- [ ] Activity logs are protected

### Production

- [ ] Vercel build succeeds
- [ ] Environment variables are available
- [ ] Menu data loads in production
- [ ] Supabase authentication redirects correctly
- [ ] Nested routes work after browser refresh
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Keyboard navigation works
- [ ] Missing product images show a neutral placeholder

## Current Business Rules

- Currency: SGD
- Payment method: Cash on Delivery
- Minimum delivery subtotal: SGD 50.00
- STAR products: Ready to Eat and not frozen
- Non-STAR frozen availability: Awaiting business confirmation
- Historical order prices are stored as snapshots
- Products referenced by historical orders should be archived instead of deleted

## Planned Improvements

- Edit and delete delivery addresses
- Enforce a single default address using a secured database operation
- Phone OTP authentication
- Customer mobile-number verification
- Product-image upload and replacement through Supabase Storage
- Complete Super Admin product-management forms
- Complete category-management forms
- Complete Admin-account-management forms
- Advanced reporting and order analytics
- Cultural background motifs using subtle South Indian heritage-inspired artwork

## Company Information

**RKJ THONDAMANS FOOD PTE LTD**

Manufacturer & Distributor for Fresh & Frozen Food

```text
12 Woodlands Square Tower 1
#06-64
Singapore 737715
```

## Maintainer

**Lavanya Muthuvel**

## License

This is proprietary software developed for RKJ THONDAMANS FOOD PTE LTD.

All rights reserved by Lavya.
