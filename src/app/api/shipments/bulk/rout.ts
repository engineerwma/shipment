// app/api/shipments/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import * as XLSX from 'xlsx';
import { verifyToken } from '../../../../lib/auth-utils';

export const dynamic = 'force-dynamic'; // Important for Vercel
export const maxDuration = 60; // Max 60 seconds for Vercel Pro, 10s for Hobby

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
  console.log('Bulk upload API called on Vercel');
  
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      console.log('No token found');
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Invalid token');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    // Check permissions
    const userRole = decoded.role;
    if (!['ADMIN', 'MERCHANT'].includes(userRole)) {
      console.log('Insufficient permissions for user role:', userRole);
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { 
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    console.log('User authenticated:', user.email);

    // Check content type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      console.log('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file in form data');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    console.log('File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      console.log('Invalid file type:', file.name);
      return NextResponse.json(
        { error: 'Only Excel files are allowed (.xlsx, .xls)' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    // Validate file size - Vercel has 4.5MB limit for Serverless Functions
    if (file.size > 4 * 1024 * 1024) { // 4MB for safety
      console.log('File too large:', file.size);
      return NextResponse.json(
        { error: 'File size must be less than 4MB on Vercel' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    // Read Excel file
    console.log('Reading Excel file...');
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<ExcelShipmentRow>(worksheet);

    console.log('Excel rows parsed:', data.length);

    if (!data.length) {
      return NextResponse.json(
        { error: 'Excel file is empty' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    // Limit rows for Vercel timeout constraints
    const MAX_ROWS = userRole === 'ADMIN' ? 100 : 50; // Smaller limits for Vercel
    if (data.length > MAX_ROWS) {
      console.log(`Too many rows: ${data.length}, limiting to ${MAX_ROWS}`);
      return NextResponse.json(
        { 
          error: `Maximum ${MAX_ROWS} rows allowed per upload on Vercel. Your file has ${data.length} rows.`,
          maxRows: MAX_ROWS,
          yourRows: data.length
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        }
      );
    }

    const results = {
      total: data.length,
      successful: 0,
      failed: 0,
      errors: [] as Array<{ row: number; error: string }>,
      createdIds: [] as string[],
    };

    console.log('Processing rows...');
    
    // Process each row with error handling
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

        // Validate optional numeric fields
        const optionalNumericFields = ['Weight (kg)', 'COD Amount (EGP)'];
        for (const field of optionalNumericFields) {
          const value = row[field as keyof ExcelShipmentRow];
          if (value !== undefined && value !== null && value !== '') {
            const numValue = Number(value);
            if (isNaN(numValue) || numValue < 0) {
              throw new Error(`${field} must be a positive number if provided`);
            }
          }
        }

        // Get merchant
        let merchantId = user.id;
        let merchant = user;

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
              merchant = specifiedMerchant;
            } else {
              throw new Error(`Merchant with email "${merchantEmail}" not found`);
            }
          }
        }

        // Generate unique tracking number and barcode
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9).toUpperCase();
        const trackingNumber = `TRK${timestamp}${random}`;
        const barcode = `BRC${timestamp}${random}`;

        console.log(`Creating shipment ${i + 1}/${data.length}...`);

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
        console.error(`Error in row ${rowNumber}:`, error.message);
        results.failed++;
        results.errors.push({
          row: rowNumber,
          error: error.message || 'Unknown error',
        });
      }
    }

    console.log('Bulk upload completed:', results);

    // Return success response
    return NextResponse.json({
      message: 'Bulk upload completed',
      ...results,
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error('Bulk upload API error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  console.log('CORS preflight request');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for bulk upload.' },
    { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    }
  );
}

export async function HEAD() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    }
  );
}
