import PDFDocument from 'pdfkit';
import bwipjs from 'bwip-js';
import Order from '../db-operations/models/Order.js';

// Generate barcode as base64 image
const generateBarcode = async (text) => {
  try {
    const png = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: text,
      scale: 3,
      height: 50,
      includetext: true,
      textxalign: 'center',
    });
    return png;
  } catch (error) {
    console.error('Barcode generation error:', error);
    throw error;
  }
};

// Generate invoice PDF for a specific product in an order
export const generateProductInvoice = async (orderId, productIndex) => {
  try {
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (!order) {
      throw new Error('Order not found');
    }

    if (!order.orderItems || productIndex >= order.orderItems.length) {
      throw new Error('Product not found in order');
    }

    const product = order.orderItems[productIndex];
    const doc = new PDFDocument({ 
      size: [612, 792], // US Letter size
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Create buffers to store PDF
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Colors matching the design (dark green and red)
    const darkGreen = '#006400';
    const red = '#FF0000';

    // Header Section
    doc.rect(50, 50, 512, 80).stroke(darkGreen);
    
    // Logo box (left side)
    doc.rect(60, 60, 100, 60).stroke(darkGreen);
    doc.fontSize(16)
       .fillColor(darkGreen)
       .font('Helvetica-Bold')
       .text('LOGO', 65, 85, { width: 90, align: 'center' });

    // Company name and priority mail (right side)
    doc.rect(170, 60, 392, 60).stroke(darkGreen);
    
    // Company name section
    doc.fontSize(14)
       .fillColor(darkGreen)
       .font('Helvetica-Bold')
       .text('NAME OF YOUR COMPANY', 175, 70, { width: 382, align: 'center' });
    
    // Priority mail section
    doc.rect(170, 100, 392, 20).stroke(darkGreen);
    doc.fontSize(12)
       .fillColor(red)
       .font('Helvetica-Bold')
       .text('PRIORITY MAIL', 175, 105, { width: 382, align: 'center' });

    let yPos = 150;

    // Sender and Recipient Information Section
    doc.rect(50, yPos, 512, 120).stroke(darkGreen);
    
    // Left column - From
    doc.rect(50, yPos, 256, 120).stroke(darkGreen);
    doc.fontSize(12)
       .fillColor(darkGreen)
       .font('Helvetica-Bold')
       .text('From :', 60, yPos + 10);
    
    doc.fontSize(10)
       .font('Helvetica')
       .text('Company Name', 60, yPos + 30);
    doc.text('Address, City', 60, yPos + 45);
    doc.text('ZIP, State', 60, yPos + 60);

    // Right column - To
    doc.rect(306, yPos, 256, 120).stroke(darkGreen);
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('To :', 316, yPos + 10);
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(order.shippingAddress.fullName || 'N/A', 316, yPos + 30);
    doc.text(order.shippingAddress.address || 'N/A', 316, yPos + 45);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 316, yPos + 60);
    doc.text(order.shippingAddress.state || order.shippingAddress.country || 'N/A', 316, yPos + 75);

    yPos = 290;

    // Package Details and Reference Numbers Section
    doc.rect(50, yPos, 512, 120).stroke(darkGreen);
    
    // Left column - Package Details
    doc.rect(50, yPos, 256, 120).stroke(darkGreen);
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Package Details:', 60, yPos + 10);
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Weight: ${product.quantity} unit(s)`, 60, yPos + 30);
    doc.text(`Product Name: ${product.name}`, 60, yPos + 45);
    doc.text(`Quantity: ${product.quantity}`, 60, yPos + 60);
    doc.text(`Price: ₹${(product.price * product.quantity).toFixed(2)}`, 60, yPos + 75);

    // Right column - Lot and Reference Numbers
    doc.rect(306, yPos, 256, 120).stroke(darkGreen);
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('LOT NUMBER:', 316, yPos + 10);
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(order._id.toString().slice(-8), 316, yPos + 30);
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('REF NUMBER:', 316, yPos + 50);
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(product.product?._id?.toString().slice(-8) || 'N/A', 316, yPos + 70);

    yPos = 430;

    // Barcode Section
    doc.rect(50, yPos, 512, 150).stroke(darkGreen);
    
    // Generate barcode with order ID and product index for easy scanning
    // Format: INV-{orderId}-{productIndex}
    const barcodeText = `INV-${order._id}-${productIndex}`;
    const barcodeImage = await generateBarcode(barcodeText);
    
    // Add barcode image to PDF
    doc.image(barcodeImage, 50 + (512 - 400) / 2, yPos + 20, { 
      width: 400, 
      height: 80,
      align: 'center'
    });

    // Handle with care text
    doc.fontSize(14)
       .fillColor(red)
       .font('Helvetica-Bold')
       .text('HANDLE WITH CARE', 50, yPos + 110, { width: 512, align: 'center' });

    // Tracking number
    const trackingNumber = `00${order._id.toString().slice(-15)}`.padStart(15, '0');
    doc.fontSize(12)
       .fillColor(darkGreen)
       .font('Helvetica-Bold')
       .text(`TRACKING: ${trackingNumber}`, 50, yPos + 130, { width: 512, align: 'center' });

    // Footer with order date
    doc.fontSize(8)
       .fillColor(darkGreen)
       .font('Helvetica')
       .text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`, 50, 750, { width: 512, align: 'center' });

    doc.end();

    // Wait for PDF to be generated
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    throw error;
  }
};

// Generate invoice for all products in an order (combined PDF)
export const generateOrderInvoice = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (!order) {
      throw new Error('Order not found');
    }

    // Generate a PDF for each product and combine them
    const pdfBuffers = [];
    for (let i = 0; i < order.orderItems.length; i++) {
      const pdfBuffer = await generateProductInvoice(orderId, i);
      pdfBuffers.push(pdfBuffer);
    }

    // For now, return the first product's invoice
    // In a more advanced implementation, you could combine multiple PDFs
    return pdfBuffers[0] || pdfBuffers;
  } catch (error) {
    console.error('Order invoice generation error:', error);
    throw error;
  }
};

