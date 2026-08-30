# billing desk template 2

Create a premium, professional SaaS billing dashboard UI/UX template called "Billing Desk".

IMPORTANT:

This is ONLY a frontend UI/UX prototype and visual design exercise.

DO NOT build:

- Backend

- PHP

- MySQL

- Supabase

- Firebase

- Authentication

- APIs

- Database

- Business logic

- Payment processing

- Real data integrations

Use:

- React

- Vite

- TypeScript

- Tailwind CSS

- Lucide icons

Use realistic dummy/mock data only.

The purpose of this project is to create a high-quality UI template that will later be used as the visual/design reference for an existing PHP + MySQL billing application. The existing backend and business logic will remain unchanged.

DESIGN GOAL:

The application must look like a polished commercial SaaS product that could be sold to businesses.

Avoid the appearance of a generic admin template or college project.

The UI should be:

- Premium

- Professional

- Modern

- Compact

- Clean

- Fast

- Business focused

- Easy to use

- Mobile friendly

Do NOT use oversized fonts, excessive whitespace, huge cards or excessive rounded containers.

Use subtle shadows, depth and tasteful 3D effects where they improve the interface. Keep the overall design professional rather than flashy.

MAIN NAVIGATION:

- Home

- Create Invoice

- Customers

- Products

- Enquiries

- Invoice History

- Reports

- More ▾

Profile should be on the top-right.

Profile dropdown:

- Profile

- Setup

- Logout

The navigation/header must remain consistent across every screen.

SCREENS TO DESIGN:

1. HOME / DASHBOARD

Create a compact professional dashboard containing:

- Today's Sales

- Monthly Sales

- Invoices

- Customers

- Average Invoice Value

- GST Collected

Charts:

- Sales trend

- Top products

- Top customers

- Payment methods

Recent invoices table.

Include a prominent:

"+ Create Invoice"

button.

2. CREATE INVOICE

This is the most important screen.

Design it for fast daily billing.

Include:

Customer section:

- Mobile number

- Customer search/autocomplete

- Customer name

- Email

Invoice section:

- Invoice number

- Invoice date

- Payment method

- GST Billing checkbox

Products section:

Product | Qty | Price | GST | Amount

Include:

"+ Add Item"

right aligned underneath the product section.

Invoice summary:

Subtotal

Discount

GST

Grand Total

Primary action:

CREATE INVOICE

Make the screen compact so the user can perform billing without unnecessary scrolling.

3. CUSTOMERS

Include:

- Search

- Add Customer

- Pagination

- Sorting

Table:

Name

Mobile

Email

Invoices

Total Purchase

Last Purchase

Actions

Customer detail page should show:

- Customer information

- Total purchases

- Invoice count

- Last purchase

- Invoice history

Actions:

- Create Invoice

- Call

- WhatsApp

- Email

4. PRODUCTS

Include:

- Search

- Add Product

- Import

- Export

- Pagination

- Sorting

Table:

Product

SKU

Category

HSN/SAC

Price

GST

Status

Actions

5. ENQUIRIES

Include:

- Search

- Pagination

- Sorting

Table:

Customer

Mobile

Location

Date

Status

Actions

Use a compact Actions dropdown containing:

- Call

- WhatsApp

- Bill Now

- View

6. INVOICE HISTORY

Include:

- Search

- Date filter

- Customer filter

- Status filter

- Payment method filter

- Sorting

- Pagination

Table:

Invoice

Customer

Date

Amount

Payment

Status

Created By

Actions

Actions dropdown:

- View

- Print

- Email

- Duplicate

- Cancel

7. REPORTS

Create a professional reports interface.

Categories:

Sales

- Daily Sales

- Monthly Sales

- Invoice Register

- Product Sales

- Customer Sales

- Payment Method

- GST Report

Customers

- New Customers

- Repeat Customers

- Top Customers

Products

- Top Products

- Product Revenue

- Product Quantity

Invoices

- Cancelled Invoices

- User-wise Sales

Include:

- Date range

- Filters

- Search

- Sort

- Pagination

- Export Excel button

8. SETUP

Create a professional settings interface with a two-column layout.

Left menu:

- Business

- Invoice

- Printing

- Themes

- Modules & Tabs

- Users

- Permissions

- Activity Log

- Backup

Right side displays the selected setting.

9. THEMES

Create several professional themes:

- Royal Blue

- Professional Navy

- Emerald

- Burgundy

- Purple

- Teal

- Indigo

- Slate

- Orange

- Charcoal

Theme changes should affect the entire application consistently.

Use centralized CSS variables/design tokens rather than hardcoded colors.

10. PRINT PREVIEW

Create visual examples of:

- A4 Formal Invoice

- A5 Invoice

- 80mm Thermal Receipt

- 58mm Thermal Receipt

These are UI mockups only.

MOBILE DESIGN:

Mobile is extremely important because Billing Desk will frequently be used on phones.

Do not simply shrink the desktop layout.

Design dedicated responsive layouts for:

- Dashboard

- Create Invoice

- Customers

- Products

- Enquiries

- Invoice History

Especially optimize customer mobile-number search and product entry.

COMPONENT SYSTEM:

Create reusable components such as:

- AppShell

- Header

- Navigation

- ProfileMenu

- PageHeader

- DashboardCard

- DataTable

- SearchBar

- Pagination

- FilterBar

- SortableTableHeader

- Modal

- Dropdown

- ActionMenu

- FormField

- CustomerLookup

- ProductSelector

- InvoiceItems

- InvoiceSummary

- StatusBadge

- Toast

- EmptyState

- LoadingState

DESIGN SYSTEM:

Create centralized design tokens for:

- Primary

- Secondary

- Accent

- Background

- Surface

- Border

- Text

- Muted

- Success

- Warning

- Danger

Use consistent:

- typography

- spacing

- buttons

- inputs

- tables

- badges

- cards

- dialogs

- icons

INTERACTION DETAILS:

Include realistic UI states for:

- loading

- empty results

- validation errors

- success

- confirmation dialogs

- disabled buttons

- hover

- focus

- active navigation

For validation, use professional red highlighting and concise error messages.

Do not implement actual business logic.

MOCK DATA:

Use realistic sample data for:

- Customers

- Products

- Invoices

- Enquiries

- Reports

- Dashboard statistics

Keep mock data separate from UI components so it can later be replaced with API data.

IMPORTANT ARCHITECTURE:

Keep the project frontend-only.

The final design should be easy to adapt later to an existing PHP/MySQL API.

Do not create any assumptions about the backend.

The final project must build with:

npm run build

and produce a normal Vite dist/ folder.

FINAL OBJECTIVE:

Create a visually impressive but practical Billing Desk UI that looks like a mature commercial SaaS product.

The design should make a business owner think:

"This is professional billing software."

NOT:

"This is a generic React dashboard."

Start by building the complete App Shell, Dashboard and Create Invoice screen first, then use the same design system consistently across the remaining screens.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2e2f514c-e648-4f32-8e0f-8c1a1e641c75).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
