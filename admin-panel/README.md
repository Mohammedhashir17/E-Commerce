# Admin Panel - E-Commerce

Admin panel for managing the e-commerce application.

## Features

- **Dashboard**: Overview of products, orders, shipments, and revenue
- **Products Management**: Add, edit, and delete products
- **Orders Management**: View and manage all orders
- **Shipments Management**: Track and update shipment status
- **Offers Management**: Create and manage product offers/discounts

## Setup

1. Navigate to admin-panel directory:
```bash
cd admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The admin panel will run on `http://localhost:3001`

## Admin Access

To access the admin panel:
1. Create a user account with `role: 'admin'` in the database
2. Login with admin credentials at `/admin/login`

## Note

The admin panel requires a user with `role: 'admin'` to access. Regular users cannot access admin routes.

