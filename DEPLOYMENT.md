# Deployment Guide

This guide covers different deployment options for the Logistics Management System.

## Table of Contents
1. [Vercel Deployment](#vercel-deployment)
2. [Docker Deployment](#docker-deployment)
3. [VPS Deployment](#vps-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Post-Deployment](#post-deployment)

---

## Vercel Deployment

Vercel is the recommended platform for Next.js applications.

### Prerequisites
- Vercel account
- PostgreSQL database (recommended: Neon, Supabase, or Railway)
- GitHub/GitLab account

### Steps

1. **Push your code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/logistics-system.git
git push -u origin main
```

2. **Import to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure environment variables (see below)

3. **Configure Build Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

4. **Add Environment Variables:**
Go to Project Settings → Environment Variables and add all variables from `.env.example`

5. **Deploy:**
Click "Deploy" and wait for the build to complete.

### Database Setup for Vercel

Use a hosted PostgreSQL service:

**Option 1: Neon (Recommended)**
```bash
# Sign up at neon.tech
# Create a new project
# Copy the connection string
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/db"
```

**Option 2: Supabase**
```bash
# Sign up at supabase.com
# Create a new project
# Go to Database Settings
# Copy the connection string
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

**Option 3: Railway**
```bash
# Sign up at railway.app
# Create PostgreSQL database
# Copy connection string
DATABASE_URL="postgresql://postgres:password@containers.railway.app:7432/railway"
```

---

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: logistics
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: logistics_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://logistics:your_password@postgres:5432/logistics_db
      JWT_SECRET: your_jwt_secret
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: your_nextauth_secret
    depends_on:
      - postgres
    command: sh -c "npx prisma db push && node server.js"

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## VPS Deployment (Ubuntu)

### Prerequisites
- Ubuntu 20.04+ server
- Root or sudo access
- Domain name (optional)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE logistics_db;
CREATE USER logistics WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE logistics_db TO logistics;
\q
```

### Step 3: Deploy Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/logistics-system.git
cd logistics-system

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with your values

# Run Prisma migrations
npx prisma generate
npx prisma db push

# Build application
npm run build

# Start with PM2
pm2 start npm --name "logistics" -- start
pm2 save
pm2 startup
```

### Step 4: Nginx Configuration

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/logistics
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/logistics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
JWT_SECRET="generate-strong-random-string"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-strong-random-string"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Optional Variables

```env
# SMS Gateway
SMS_API_KEY="your-api-key"
SMS_API_SECRET="your-api-secret"
SMS_SENDER_NUMBER="+1234567890"

# WhatsApp
WHATSAPP_API_KEY="your-api-key"
WHATSAPP_SENDER_NUMBER="+1234567890"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Generating Secrets

```bash
# Generate random secret
openssl rand -base64 32
```

---

## Database Setup

### Initial Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### Backup Database

```bash
# Backup
pg_dump -U logistics -d logistics_db > backup.sql

# Restore
psql -U logistics -d logistics_db < backup.sql
```

---

## Post-Deployment

### 1. Verify Deployment

- Access your application URL
- Test login with demo accounts
- Create a test shipment
- Verify email/SMS notifications work

### 2. Monitor Application

```bash
# View PM2 logs
pm2 logs logistics

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Monitor resources
pm2 monit
```

### 3. Setup Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-logistics.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/logistics"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U logistics -d logistics_db > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/logistics-system/public/uploads

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-logistics.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-logistics.sh
```

### 4. Setup SSL Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically adds cron job
```

### 5. Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall (ufw)
- [ ] Setup fail2ban
- [ ] Regular security updates
- [ ] Secure database access
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Regular backups
- [ ] Monitor logs

---

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U logistics -d logistics_db -h localhost

# Check firewall
sudo ufw status
```

### PM2 Issues

```bash
# Restart application
pm2 restart logistics

# Check status
pm2 status

# View logs
pm2 logs logistics --lines 100
```

---

## Support

For deployment issues:
- Check logs first
- Verify environment variables
- Test database connection
- Check firewall rules
- Review Nginx configuration

For additional help, contact: support@logistics.com
