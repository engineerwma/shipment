# Quick Start Guide

Get your Logistics Management System up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org/))
- PostgreSQL installed ([Download here](https://www.postgresql.org/download/))
- Git installed
- Code editor (VS Code recommended)

## Installation Steps

### 1. Clone or Download the Project

```bash
# If you have the files
cd logistics-system

# Or clone from repository
git clone https://github.com/yourusername/logistics-system.git
cd logistics-system
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (Next.js, Prisma, Tailwind, etc.)

### 3. Setup Database

#### Create PostgreSQL Database

```bash
# Open PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE logistics_db;

# Exit psql
\q
```

#### Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/logistics_db"
JWT_SECRET="your-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

#### Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

Login with these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@demo.com | demo123 |
| **Merchant** | merchant@demo.com | demo123 |
| **Driver** | driver@demo.com | demo123 |
| **Operations** | ops@demo.com | demo123 |

## First Steps After Login

### As Admin
1. Go to Dashboard → See system overview
2. Navigate to Shipments → View all shipments
3. Check Drivers → See active drivers
4. Review Warehouses → Manage distribution centers
5. Access Finance → Monitor revenue and transactions

### As Merchant
1. Click "New Shipment" button
2. Fill in customer details
3. Set shipping cost and COD amount
4. Save and track the shipment
5. View your balance in the dashboard

### As Driver
1. View assigned shipments
2. Click "Navigate" to get directions
3. Mark shipment as "Delivered" or "Failed"
4. Upload proof of delivery
5. Track your daily earnings

### As Operations
1. Manage warehouse inventory
2. Distribute shipments to drivers
3. Scan barcodes for sorting
4. Monitor warehouse capacity
5. Generate dispatch reports

## Key Features to Try

### 1. Create a Shipment
- Login as Merchant
- Click "New Shipment"
- Fill customer information
- Set pricing
- Save and get tracking number

### 2. Track Shipment
- Copy tracking number
- Use tracking interface
- See real-time status updates
- View shipment history

### 3. Print Waybill
- Go to shipment details
- Click "Print Waybill"
- PDF will be generated
- Print for delivery

### 4. Update Delivery Status
- Login as Driver
- View assigned shipments
- Click "Delivered" button
- Upload proof of delivery
- Confirm delivery

### 5. Generate Reports
- Login as Admin
- Go to Reports section
- Select date range
- Export as CSV or PDF
- Analyze performance

## Customization

### Change Language

Click the globe icon (🌐) in the top right corner to switch between English and Arabic.

### Update Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
      }
    }
  }
}
```

### Add New User Role

1. Update `prisma/schema.prisma`:
```prisma
enum UserRole {
  ADMIN
  MERCHANT
  DRIVER
  OPERATIONS
  YOUR_NEW_ROLE
}
```

2. Run migration:
```bash
npx prisma db push
```

3. Add role-specific pages in `src/app/your-role/`

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error

1. Check PostgreSQL is running:
```bash
# Mac/Linux:
sudo service postgresql status

# Windows: Check services panel
```

2. Verify credentials in `.env`
3. Test connection:
```bash
psql -U postgres -d logistics_db
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Prisma Errors

```bash
# Reset Prisma client
npx prisma generate

# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset
```

## Next Steps

### Development
- Read full documentation in `README.md`
- Explore API routes in `src/app/api/`
- Customize UI components
- Add new features

### Production
- Follow `DEPLOYMENT.md` for deployment guide
- Setup SSL certificates
- Configure production database
- Enable error monitoring

### Integration
- Setup SMS gateway (Twilio)
- Configure email service
- Add Google Maps API
- Integrate payment gateway

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio (GUI)
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma db pull   # Pull schema from database

# Testing (when configured)
npm test             # Run tests
npm run test:e2e     # Run E2E tests
```

## Project Structure Overview

```
logistics-system/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── merchant/       # Merchant portal pages
│   │   ├── driver/         # Driver app pages
│   │   ├── operations/     # Operations pages
│   │   ├── api/            # API routes
│   │   └── login/          # Authentication
│   ├── components/         # Reusable components
│   └── lib/                # Utilities and helpers
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── tailwind.config.js      # Tailwind configuration
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

Need help? 

- 📧 Email: support@logistics.com
- 💬 Discord: [Join our community]
- 📚 Docs: Check README.md and DEPLOYMENT.md
- 🐛 Issues: GitHub Issues

## License

MIT License - See LICENSE file for details

---

**Happy coding! 🚀**

If you found this helpful, please consider giving the project a star on GitHub!
