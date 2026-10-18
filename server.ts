import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const RECIPIENT_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL || 'neevfataniya@gemil.com';

app.use(express.json());

// Check email service configuration status
app.get('/api/contact/status', (req, res) => {
  const isSmtpConfigured = Boolean(
    process.env.SMTP_HOST && 
    process.env.SMTP_USER && 
    process.env.SMTP_PASS
  );

  res.json({
    configured: isSmtpConfigured,
    recipientEmail: RECIPIENT_EMAIL,
    phone: '7862828010',
    businessName: 'Neev Fashion Hub',
    smtpHost: process.env.SMTP_HOST || null,
    hasUser: Boolean(process.env.SMTP_USER),
  });
});

// Google Merchant Center Product Feed (XML RSS 2.0)
app.get('/api/feed.xml', async (req, res) => {
  try {
    const { PRODUCTS } = await import('./src/data/products.js');
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;

    const itemsXml = PRODUCTS.map((p) => `    <item>
      <g:id>NFH-${p.id}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:link>${baseUrl}/#product-${p.id}</g:link>
      <g:image_link>${p.image}</g:image_link>
      <g:brand>Neev Fashion Hub</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${p.price}.00 INR</g:price>
      <g:gender>${p.gender}</g:gender>
      <g:sizes>${p.sizes.join(', ')}</g:sizes>
      <g:colors>${p.colors.join(', ')}</g:colors>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing</g:google_product_category>
    </item>`).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Neev Fashion Hub Product Feed</title>
    <link>${baseUrl}</link>
    <description>Affordable everyday Indian clothing catalog feed for Google Merchant Center</description>
${itemsXml}
  </channel>
</rss>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (e: any) {
    res.status(500).send(`Error generating product feed: ${e.message}`);
  }
});

// Google Merchant Center JSON Feed
app.get('/api/feed.json', async (req, res) => {
  try {
    const { PRODUCTS } = await import('./src/data/products.js');
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;

    const feed = PRODUCTS.map((p) => ({
      id: `NFH-${p.id}`,
      title: p.name,
      description: p.description,
      link: `${baseUrl}/#product-${p.id}`,
      image_link: p.image,
      brand: 'Neev Fashion Hub',
      condition: 'new',
      availability: 'in_stock',
      price: `${p.price}.00 INR`,
      gender: p.gender,
      sizes: p.sizes,
      colors: p.colors,
      google_product_category: 'Apparel & Accessories > Clothing',
    }));

    res.json({
      title: 'Neev Fashion Hub Product Feed',
      store: 'Neev Fashion Hub',
      currency: 'INR',
      targetCountry: 'IN',
      itemCount: feed.length,
      items: feed,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Process Contact Form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    // Validate fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, error: 'Full Name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid Customer Email Address is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'Phone Number is required.' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, error: 'Subject is required.' });
    }
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Message must be at least 5 characters long.' });
    }

    const isSmtpConfigured = Boolean(
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS
    );

    if (!isSmtpConfigured) {
      // Crucial requirement: Never falsely claim an email has been sent.
      return res.status(503).json({
        success: false,
        configured: false,
        error: 'Email service is not yet configured with SMTP credentials. Please configure SMTP_USER and SMTP_PASS in .env to deliver emails directly, or use the "Open in Email App" / "WhatsApp Us" buttons below.',
        recipientEmail: RECIPIENT_EMAIL,
      });
    }

    // Create transport
    const port = Number(process.env.SMTP_PORT) || 465;
    const isSecure = process.env.SMTP_SECURE === 'false' ? false : port === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    const mailOptions = {
      from: `"Neev Fashion Hub Website" <${process.env.SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `[Neev Fashion Hub] ${subject} — from ${fullName}`,
      text: `New message submitted on Neev Fashion Hub:\n\n` +
        `Customer Name: ${fullName}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Subject: ${subject}\n\n` +
        `Message:\n${message}\n\n` +
        `---\nSent via Neev Fashion Hub Contact Form on ${new Date().toLocaleString('en-IN')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 20px; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px; font-weight: bold;">Neev Fashion Hub — Customer Inquiry</h2>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #cbd5e1;">New Contact Us message received</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 140px;">Customer Name:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email Address:</td>
                <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Phone Number:</td>
                <td style="padding: 8px 0; color: #0f172a;"><a href="tel:+91${phone.replace(/\D/g, '')}" style="color: #2563eb;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Subject:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${subject}</td>
              </tr>
            </table>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 16px;">
              <h4 style="margin: 0 0 8px 0; color: #334155; font-size: 14px;">Customer Message:</h4>
              <div style="background-color: #f8fafc; border-left: 4px solid #f97316; padding: 14px; border-radius: 6px; font-size: 14px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 12px 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
            This email was sent to ${RECIPIENT_EMAIL} from the Neev Fashion Hub website contact form.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email dispatched successfully to:', RECIPIENT_EMAIL, 'MessageId:', info.messageId);

    return res.json({
      success: true,
      message: `Your message has been delivered directly to ${RECIPIENT_EMAIL}. We will respond shortly!`,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error('Failed to send email via SMTP:', error);
    return res.status(500).json({
      success: false,
      configured: true,
      error: `Email delivery failed: ${error.message || 'SMTP connection error. Please verify your credentials.'}`,
    });
  }
});

// Mount Vite middleware for dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Neev Fashion Hub server running on http://localhost:${PORT}`);
  });
}

startServer();
