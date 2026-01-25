import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create sample data
    const sampleData = [
      {
        'Customer Name': 'John Doe',
        'Customer Phone': '+201012345678',
        'Customer Address': '123 Main Street, Apartment 4B',
        'Customer City': 'Cairo',
        'Customer Zone': 'Nasr City',
        'Description': 'Electronics - Laptop Dell XPS 15',
        'Weight (kg)': 2.5,
        'Dimensions': '30x20x10 cm',
        'Declared Value (EGP)': 15000,
        'Shipping Cost (EGP)': 50,
        'COD Amount (EGP)': 0,
        'Merchant Email': 'merchant@example.com', // Optional for admin uploads
      },
      {
        'Customer Name': 'Jane Smith',
        'Customer Phone': '01098765432',
        'Customer Address': '456 Garden Avenue, Villa 12',
        'Customer City': 'Alexandria',
        'Customer Zone': 'Smouha',
        'Description': 'Clothes - Summer Collection (5 items)',
        'Weight (kg)': 1.2,
        'Dimensions': '40x30x15 cm',
        'Declared Value (EGP)': 2000,
        'Shipping Cost (EGP)': 35,
        'COD Amount (EGP)': 2000,
        'Merchant Email': '', // Leave empty to use your account
      },
      {
        'Customer Name': 'Ahmed Mohamed',
        'Customer Phone': '+201112223344',
        'Customer Address': '789 Downtown Square, Office 304',
        'Customer City': 'Giza',
        'Customer Zone': 'Dokki',
        'Description': 'Books - Educational Materials',
        'Weight (kg)': 3.0,
        'Dimensions': '25x15x20 cm',
        'Declared Value (EGP)': 500,
        'Shipping Cost (EGP)': 25,
        'COD Amount (EGP)': 500,
        'Merchant Email': 'another.merchant@business.com',
      },
    ];

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    
    // Add instructions as a separate sheet
    const instructions = [
      ['IMPORTANT INSTRUCTIONS:'],
      [''],
      ['REQUIRED FIELDS:'],
      ['✓ Customer Name - Full name of the customer'],
      ['✓ Customer Phone - Egyptian phone number (format: +20XXXXXXXXXXX or 01XXXXXXXXX)'],
      ['✓ Customer Address - Complete delivery address'],
      ['✓ Customer City - Delivery city'],
      ['✓ Description - Package contents description'],
      ['✓ Declared Value (EGP) - Value of items in EGP'],
      ['✓ Shipping Cost (EGP) - Shipping cost in EGP'],
      [''],
      ['OPTIONAL FIELDS:'],
      ['○ Customer Zone - Delivery zone/district'],
      ['○ Weight (kg) - Package weight in kilograms'],
      ['○ Dimensions - Package dimensions (e.g., 30x20x10 cm)'],
      ['○ COD Amount (EGP) - Cash on Delivery amount (0 if not COD)'],
      ['○ Merchant Email - For admins: assign to specific merchant'],
      [''],
      ['IMPORTANT NOTES:'],
      ['1. Do not modify or delete column headers'],
      ['2. Phone numbers must be valid Egyptian numbers'],
      ['3. All amounts should be in EGP'],
      ['4. Remove sample rows before adding your own data'],
      ['5. Save file as .xlsx before uploading'],
      ['6. Maximum file size: 5MB'],
      ['7. Maximum rows per upload: 1000'],
      [''],
      ['TROUBLESHOOTING:'],
      ['• Invalid phone: Use +20XXXXXXXXXXX or 01XXXXXXXXX format'],
      ['• Required field missing: All marked fields must be filled'],
      ['• Invalid number: Use only numbers for numeric fields'],
      ['• Merchant not found: Verify merchant email exists'],
    ];

    const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
    
    // Set column widths for better readability
    const colWidths = [
      { wch: 20 }, // Customer Name
      { wch: 20 }, // Customer Phone
      { wch: 35 }, // Customer Address
      { wch: 15 }, // Customer City
      { wch: 15 }, // Customer Zone
      { wch: 30 }, // Description
      { wch: 12 }, // Weight (kg)
      { wch: 15 }, // Dimensions
      { wch: 20 }, // Declared Value (EGP)
      { wch: 18 }, // Shipping Cost (EGP)
      { wch: 15 }, // COD Amount (EGP)
      { wch: 25 }, // Merchant Email
    ];
    
    worksheet['!cols'] = colWidths;

    // Set instruction sheet column width
    instructionSheet['!cols'] = [{ wch: 80 }];

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Shipments Template');
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    // Create response
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="shipment_bulk_upload_template.xlsx"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Template generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
