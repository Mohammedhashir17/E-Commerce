import PDFDocument from 'pdfkit';
import bwipjs from 'bwip-js';
import Order from '../db-operations/models/Order.js';

// Generate barcode as base64 image
const generateBarcode = async (text) => {
  try {
    const png = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: text,
      scale: 2, // Reduced scale for smaller barcode
      height: 40, // Reduced height
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
    // Custom size: A4 width (595) x 50% height (421 points)
    const doc = new PDFDocument({ 
      size: [595, 421], // A4 width x 50% height
      margins: { top: 20, bottom: 20, left: 30, right: 30 }
    });

    // Create buffers to store PDF
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Colors matching the design (dark green and red)
    const darkGreen = '#006400';
    const red = '#FF0000';
    const pageWidth = 595;
    const pageHeight = 421;
    const margin = 30;
    const contentWidth = pageWidth - (margin * 2);

    // Header Section - more compact
    doc.rect(margin, 20, contentWidth, 45).stroke(darkGreen);
    
    // Logo box (left side)
    doc.rect(margin + 5, 25, 70, 35).stroke(darkGreen);
    doc.fontSize(10)
       .fillColor(darkGreen)
       .font('Helvetica-Bold')
       .text('LOGO', margin + 10, 35, { width: 60, align: 'center' });

    // Company name and priority mail (right side)
    doc.rect(margin + 80, 25, contentWidth - 85, 35).stroke(darkGreen);
    
    // Company name section
    doc.fontSize(11)
       .fillColor(darkGreen)
       .font('Helvetica-Bold')
       .text('ZUKA', margin + 85, 30, { width: contentWidth - 90, align: 'center' });
    
    // Priority mail section
    doc.rect(margin + 80, 45, contentWidth - 85, 15).stroke(darkGreen);
    doc.fontSize(9)
       .fillColor(red)
       .font('Helvetica-Bold')
       .text('PRIORITY MAIL', margin + 85, 48, { width: contentWidth - 90, align: 'center' });

    let yPos = 75;

    // Sender and Recipient Information Section - more compact
    const addressHeight = 75;
    doc.rect(margin, yPos, contentWidth, addressHeight).stroke(darkGreen);
    
    // Left column - From
    doc.rect(margin, yPos, contentWidth / 2, addressHeight).stroke(darkGreen);
    doc.fontSize(9)
       .fillColor(darkGreen)
       .font('Helvetica-Bold')
       .text('From :', margin + 5, yPos + 5);
    
    doc.fontSize(8)
       .font('Helvetica')
       .text('ZUKA', margin + 5, yPos + 18);
    doc.text('12/14, Allah Bakhash Street,', margin + 5, yPos + 30);
    doc.text('Tirupattur – 635601,', margin + 5, yPos + 42);
    doc.text('Tirupattur District,', margin + 5, yPos + 54);
    doc.text('Tamil Nadu, India.', margin + 5, yPos + 66);

    // Right column - To
    doc.rect(margin + contentWidth / 2, yPos, contentWidth / 2, addressHeight).stroke(darkGreen);
    doc.fontSize(9)
       .font('Helvetica-Bold')
       .text('To :', margin + contentWidth / 2 + 5, yPos + 5);
    
    doc.fontSize(8)
       .font('Helvetica')
       .text(order.shippingAddress.fullName || 'N/A', margin + contentWidth / 2 + 5, yPos + 18);
    doc.text(order.shippingAddress.address || 'N/A', margin + contentWidth / 2 + 5, yPos + 30);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, margin + contentWidth / 2 + 5, yPos + 42);

    yPos = yPos + addressHeight + 5;

    // Package Details and Reference Numbers Section - more compact
    const detailsHeight = 60;
    doc.rect(margin, yPos, contentWidth, detailsHeight).stroke(darkGreen);
    
    // Left column - Package Details
    doc.rect(margin, yPos, contentWidth / 2, detailsHeight).stroke(darkGreen);
    doc.fontSize(9)
       .font('Helvetica-Bold')
       .text('Package Details:', margin + 5, yPos + 5);
    
    doc.fontSize(8)
       .font('Helvetica')
       .text(`Weight: ${product.quantity} unit(s)`, margin + 5, yPos + 18);
    doc.text(`Product: ${product.name}`, margin + 5, yPos + 30);
    doc.text(`Qty: ${product.quantity} | ₹${(product.price * product.quantity).toFixed(2)}`, margin + 5, yPos + 42);

    // Right column - Lot and Reference Numbers
    doc.rect(margin + contentWidth / 2, yPos, contentWidth / 2, detailsHeight).stroke(darkGreen);
    doc.fontSize(9)
       .font('Helvetica-Bold')
       .text('LOT NUMBER:', margin + contentWidth / 2 + 5, yPos + 5);
    
    doc.fontSize(8)
       .font('Helvetica')
       .text(order._id.toString().slice(-8), margin + contentWidth / 2 + 5, yPos + 18);
    
    doc.fontSize(9)
       .font('Helvetica-Bold')
       .text('REF NUMBER:', margin + contentWidth / 2 + 5, yPos + 32);
    
    doc.fontSize(8)
       .font('Helvetica')
       .text(product.product?._id?.toString().slice(-8) || 'N/A', margin + contentWidth / 2 + 5, yPos + 45);

    yPos = yPos + detailsHeight + 5;

    // Barcode Section - more compact
    const barcodeHeight = 100;
    doc.rect(margin, yPos, contentWidth, barcodeHeight).stroke(darkGreen);
    
    // Generate barcode with order ID and product index for easy scanning
    // Format: INV-{orderId}-{productIndex}
    const barcodeText = `INV-${order._id}-${productIndex}`;
    const barcodeImage = await generateBarcode(barcodeText);
    
    // Add barcode image to PDF - smaller size
    const barcodeWidth = 300;
    const barcodeImgHeight = 50;
    doc.image(barcodeImage, margin + (contentWidth - barcodeWidth) / 2, yPos + 8, { 
      width: barcodeWidth, 
      height: barcodeImgHeight
    });

    // Handle with care text
    doc.fontSize(10)
       .fillColor(red)
       .font('Helvetica-Bold')
       .text('HANDLE WITH CARE', margin, yPos + 62, { width: contentWidth, align: 'center' });

    // Tracking number
    const trackingNumber = `00${order._id.toString().slice(-15)}`.padStart(15, '0');
    doc.fontSize(9)
       .fillColor(darkGreen)
       .font('Helvetica-Bold')
       .text(`TRACKING: ${trackingNumber}`, margin, yPos + 78, { width: contentWidth, align: 'center' });

    // Footer with order date
    doc.fontSize(7)
       .fillColor(darkGreen)
       .font('Helvetica')
       .text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`, margin, pageHeight - 15, { width: contentWidth, align: 'center' });

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

