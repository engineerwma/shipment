// app/api/shipments/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import * as XLSX from 'xlsx';
import { verifyToken } from '../../../../lib/auth-utils';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface ExcelShipmentRow {
  'Customer Name': string;
  'Customer Phone': string;
  'Customer Address': string;
  'Customer City': string;
  'Customer Zone': string;
  'Description': string;
  'Weight (kg)'?: number;
  'Dimensions'?: string;
  'Declared Value (EGP)': number;
  'Shipping Cost (EGP)': number;
  'COD Amount (EGP)'?: number;
  'Merchant Email'?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Check permissions
    const userRole = decoded.role;
    if (!['ADMIN', 'MERCHANT'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get form data - App Router automatically handles multipart
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return NextResponse.json(
        { error: 'Only Excel files are allowed (.xlsx, .xls)' },
        { status: 400 }
      );
    }

    // Validate file size - Use 4MB for Vercel
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 4MB' },
        { status: 400 }
      );
    }

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<ExcelShipmentRow>(worksheet);

    if (!data.length) {
      return NextResponse.json(
        { error: 'Excel file is empty' },
        { status: 400 }
      );
    }

    // Limit rows for Vercel
    const MAX_ROWS = 50; // Conservative limit for Vercel
    if (data.length > MAX_ROWS) {
      return NextResponse.json(
        { 
          error: `Maximum ${MAX_ROWS} rows allowed per upload on Vercel. Your file has ${data.length} rows.`
        },
        { status: 400 }
      );
    }

    const results = {
      total: data.length,
      successful: 0,
      failed: 0,
      errors: [] as Array<{ row: number; error: string }>,
      createdIds: [] as string[],
    };

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2;

      try {
        // Validate required fields
        const requiredFields = [
          'Customer Name',
          'Customer Phone',
          'Customer Address', 
          'Customer City',
          'Description',
          'Declared Value (EGP)',
          'Shipping Cost (EGP)'
        ];

        for (const field of requiredFields) {
          const value = row[field as keyof ExcelShipmentRow];
          if (value === undefined || value === null || value === '') {
            throw new Error(`${field} is required`);
          }
        }

        // Validate phone number
        const phone = row['Customer Phone'].toString().trim();
        const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
          throw new Error('Invalid Egyptian phone number. Format: +20XXXXXXXXXX or 01XXXXXXXXX');
        }

        // Validate numeric fields
        const numericFields = ['Declared Value (EGP)', 'Shipping Cost (EGP)'];
        for (const field of numericFields) {
          const value = row[field as keyof ExcelShipmentRow];
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            throw new Error(`${field} must be a positive number`);
          }
        }

        // Get merchant
        let merchantId = user.id;

        // If admin is uploading and specified a merchant email
        if (userRole === 'ADMIN' && row['Merchant Email']) {
          const merchantEmail = row['Merchant Email'].toString().trim();
          if (merchantEmail) {
            const specifiedMerchant = await prisma.user.findUnique({
              where: { 
                email: merchantEmail,
                role: 'MERCHANT'
              },
            });
            
            if (specifiedMerchant) {
              merchantId = specifiedMerchant.id;
            } else {
              throw new Error(`Merchant with email "${merchantEmail}" not found`);
            }
          }
        }

        // Generate tracking number
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9).toUpperCase();
        const trackingNumber = `TRK${timestamp}${random}`;
        const barcode = `BRC${timestamp}${random}`;

        // Create shipment
        const shipment = await prisma.shipment.create({
          data: {
            trackingNumber,
            barcode,
            customerName: row['Customer Name'].toString().trim(),
            customerPhone: row['Customer Phone'].toString().trim(),
            customerAddress: row['Customer Address'].toString().trim(),
            customerCity: row['Customer City'].toString().trim(),
            customerZone: row['Customer Zone']?.toString().trim() || 'Main Zone',
            description: row['Description'].toString().trim(),
            weight: row['Weight (kg)'] ? Number(row['Weight (kg)']) : null,
            dimensions: row['Dimensions']?.toString().trim() || null,
            declaredValue: Number(row['Declared Value (EGP)']),
            shippingCost: Number(row['Shipping Cost (EGP)']),
            codAmount: row['COD Amount (EGP)'] ? Number(row['COD Amount (EGP)']) : 0,
            merchantId,
            status: 'NEW',
            statusHistory: {
              create: {
                status: 'NEW',
                notes: 'Shipment created via bulk upload',
              },
            },
          },
        });

        results.successful++;
        results.createdIds.push(shipment.id);
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          row: rowNumber,
          error: error.message || 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: 'Bulk upload completed',
      ...results,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// For CORS - optional but helpful
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
