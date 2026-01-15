# Shipping and Logistics Management System

A complete, production-ready logistics management system built with Next.js 14, TypeScript, Tailwind CSS, PostgreSQL, and Prisma. Features bilingual support (English/Arabic), real-time tracking, multi-role authentication, and comprehensive shipment management.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Admin, Merchant, Driver, and Operations roles with Better Auth
- **Bilingual Support**: Full English and Arabic translations with RTL support
- **Real-Time Tracking**: Live shipment tracking with GPS integration
- **Barcode & QR System**: Automated generation for shipment identification
- **Waybill Printing**: PDF generation for shipment documentation
- **Financial Management**: Automated commission calculation, revenue tracking, and withdrawal requests
- **Notification System**: SMS, WhatsApp, and push notifications
- **Offline Mode**: Driver app works without internet connection
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Dashboard Features

#### Admin Dashboard
- Complete system oversight and analytics
- User management (merchants, drivers, operations staff)
- Warehouse management
- Financial reports and commission tracking
- Real-time shipment monitoring
- Performance analytics

#### Merchant Portal
- Create and manage shipments
- Track shipment status in real-time
- Financial dashboard with revenue tracking
- Request withdrawals
- Bulk shipment upload
- Customer management
- Performance reports

#### Driver App
- View assigned shipments with navigation
- Update delivery status (Delivered/Failed)
- Collect proof of delivery (photos, signatures)
- Offline mode support
- Daily earnings tracker
- Route optimization

#### Operations Dashboard
- Warehouse management
- Shipment distribution to drivers
- Barcode scanning and sorting
- Inventory tracking
- Dispatch management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Maps**: Google Maps API / Leaflet
- **PDF Generation**: jsPDF
- **Barcode/QR**: jsbarcode, react-qr-code
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Google Maps API key (optional, for maps feature)

### Step 1: Clone and Install Dependencies

```bash
# Install dependencies
npm install

# or
yarn install
```

### Step 2: Database Setup

1. Create a PostgreSQL database:
```bash
createdb logistics_db
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/logistics_db"
JWT_SECRET="your-super-secret-jwt-key"
```

4. Run Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

5. (Optional) Seed the database:
```bash
npx prisma db seed
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Demo Accounts

Access the system with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | demo123 |
| Merchant | merchant@demo.com | demo123 |
| Driver | driver@demo.com | demo123 |
| Operations | ops@demo.com | demo123 |

## 📁 Project Structure

```
logistics-system/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── shipments/
│   │   │   ├── drivers/
│   │   │   ├── warehouses/
│   │   │   ├── finance/
│   │   │   └── settings/
│   │   ├── merchant/          # Merchant portal pages
│   │   │   ├── dashboard/
│   │   │   ├── shipments/
│   │   │   └── finance/
│   │   ├── driver/            # Driver app pages
│   │   │   └── dashboard/
│   │   ├── operations/        # Operations dashboard
│   │   │   ├── dashboard/
│   │   │   └── warehouses/
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── shipments/
│   │   │   ├── users/
│   │   │   └── finance/
│   │   ├── login/             # Authentication page
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   ├── lib/
│   │   ├── i18n.ts            # Internationalization
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🎨 Key Features Implementation

### Shipment Lifecycle
```
NEW → IN_RECEIPT → IN_WAREHOUSE → WITH_DRIVER → DELIVERED/DELIVERY_FAILED
```

### Status Management
- **NEW**: Shipment created by merchant
- **IN_RECEIPT**: Picked up from merchant
- **IN_WAREHOUSE**: At distribution center
- **WITH_DRIVER**: Assigned to driver for delivery
- **DELIVERED**: Successfully delivered
- **DELIVERY_FAILED**: Delivery attempt failed
- **RETURNED**: Returned to merchant
- **PARTIAL_RETURNED**: Partial return

### Financial Calculations
- Automatic commission calculation for drivers
- Merchant receivables tracking
- Net profit calculation after costs
- Return cost management
- Multi-currency support

### Notification System
- SMS notifications via Twilio/similar
- WhatsApp Business API integration
- Push notifications for mobile apps
- Email notifications
- In-app notification center

### Offline Mode (Driver App)
- Service Worker for offline functionality
- Local storage for pending updates
- Automatic sync when connection restored
- Cached maps and shipment data

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - Register new merchant
- `POST /api/auth/refresh` - Refresh token

### Shipments
- `GET /api/shipments` - List shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `POST /api/shipments/:id/status` - Update status
- `GET /api/shipments/:id/history` - Get status history
- `GET /api/shipments/:id/waybill` - Generate waybill PDF

### Users
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Finance
- `GET /api/finance/transactions` - List transactions
- `POST /api/finance/withdrawal` - Request withdrawal
- `GET /api/finance/balance` - Get balance
- `GET /api/finance/reports` - Financial reports

### Drivers
- `GET /api/drivers` - List drivers
- `GET /api/drivers/:id/location` - Get driver location
- `POST /api/drivers/:id/location` - Update driver location
- `GET /api/drivers/:id/shipments` - Get assigned shipments

### Warehouses
- `GET /api/warehouses` - List warehouses
- `POST /api/warehouses` - Create warehouse
- `GET /api/warehouses/:id` - Get warehouse details
- `PUT /api/warehouses/:id` - Update warehouse

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/logistics_db"

# Authentication
JWT_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# SMS Gateway (Twilio)
SMS_API_KEY="your-sms-api-key"
SMS_API_SECRET="your-sms-secret"
SMS_SENDER_NUMBER="+1234567890"

# WhatsApp API
WHATSAPP_API_KEY="your-whatsapp-key"
WHATSAPP_SENDER_NUMBER="+1234567890"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker-compose up -d
```

### Manual Deployment
```bash
npm run build
npm start
```

## 📱 Mobile App

The driver app is optimized for mobile devices with:
- Progressive Web App (PWA) support
- Offline functionality
- GPS tracking
- Camera integration for proof of delivery
- Touch-optimized interface

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Encrypted passwords with bcrypt
- HTTPS enforcement in production
- SQL injection prevention with Prisma
- XSS protection
- CSRF tokens
- Rate limiting on API routes

## 🌍 Internationalization

Full bilingual support with:
- English (EN) - LTR
- Arabic (AR) - RTL

To add more languages, update `src/lib/i18n.ts`.

## 📊 Performance Optimization

- Server-side rendering (SSR)
- Static page generation where applicable
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Database query optimization with Prisma
- Caching strategies
- CDN integration for static assets

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Run linting
npm run lint
```

## 📈 Monitoring

Recommended monitoring tools:
- Error tracking: Sentry
- Performance: Vercel Analytics
- Database: Prisma Studio
- Logs: Winston or Pino

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Support

For support, email support@logistics.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Mobile apps (iOS & Android)
- [ ] Advanced analytics dashboard
- [ ] AI-powered route optimization
- [ ] Customer portal
- [ ] Multi-tenant support
- [ ] Automated dispatching system
- [ ] Integration with shipping carriers
- [ ] Advanced reporting tools
- [ ] Webhook support
- [ ] GraphQL API

## 📞 Contact

- Website: https://logistics.com
- Email: info@logistics.com
- Twitter: @logistics_system
