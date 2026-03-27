import { Html, Head, Body, Container, Section, Button } from '@react-email/components';

interface InvoiceEmailProps {
  name: string;
  invoiceNumber: string;
  invoiceDate: string;
  plan: string;
  amount: string;
  nextBilling: string;
  paymentMethod: string;
}

const InvoiceEmail = ({ name, invoiceNumber, invoiceDate, plan, amount, nextBilling, paymentMethod }: InvoiceEmailProps) => (
  <Html>
    <Head>
      <style>
        {`
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 30px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
          .title { color: white; font-size: 28px; margin-bottom: 10px; }
          .subtitle { color: #e0e7ff; font-size: 16px; }
          .content { padding: 40px 30px; background: #f8fafc; }
          .invoice-box { background: white; border-radius: 12px; padding: 30px; margin: 20px 0; border: 2px solid #e5e7eb; }
          .invoice-header { display: flex; justify-content: space-between; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
          .invoice-number { font-size: 14px; color: #6b7280; }
          .invoice-date { font-size: 14px; color: #6b7280; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; padding: 15px; background: #f9fafb; border-radius: 8px; }
          .detail-label { color: #6b7280; font-size: 14px; }
          .detail-value { color: #1f2937; font-weight: 600; }
          .total-row { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
          .total-label { color: #1f2937; font-size: 18px; font-weight: bold; }
          .total-amount { color: #10b981; font-size: 24px; font-weight: bold; }
          .payment-info { background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          <h1 className="title">📄 Invoice Receipt</h1>
          <p className="subtitle">Thank you for your payment</p>
        </Section>

        {/* Content */}
        <Section className="content">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Hi {name}!</h2>
            <p style={{ color: '#6b7280' }}>Your payment has been processed successfully. Here's your invoice.</p>
          </div>

          {/* Invoice Box */}
          <div className="invoice-box">
            <div className="invoice-header">
              <div>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#1f2937' }}>INVOICE</p>
                <p className="invoice-number">#{invoiceNumber}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#1f2937' }}>DATE</p>
                <p className="invoice-date">{invoiceDate}</p>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Bill To:</p>
              <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>{name}</p>
            </div>

            <div className="detail-row">
              <span className="detail-label">Subscription Plan</span>
              <span className="detail-value">{plan}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Billing Period</span>
              <span className="detail-value">{invoiceDate} - {nextBilling}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Payment Method</span>
              <span className="detail-value">{paymentMethod}</span>
            </div>

            <div className="total-row">
              <span className="total-label">Total Paid</span>
              <span className="total-amount">{amount}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="payment-info">
            <h3 style={{ color: '#1e40af', marginBottom: '10px', fontSize: '16px' }}>💳 Payment Information</h3>
            <p style={{ margin: '0 0 10px 0', color: '#1e40af', fontSize: '14px' }}>
              <strong>Next Billing Date:</strong> {nextBilling}
            </p>
            <p style={{ margin: 0, color: '#1e40af', fontSize: '14px' }}>
              <strong>Status:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>✅ Paid</span>
            </p>
          </div>

          {/* Actions */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button href="https://premierleaguetables.com/invoices" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', fontSize: '14px' }}>
                View All Invoices
              </Button>
              <Button href="https://premierleaguetables.com/account" style={{ background: '#6b7280', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', fontSize: '14px' }}>
                Manage Subscription
              </Button>
            </div>
          </div>

          {/* Support Info */}
          <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: 'white', borderRadius: '12px' }}>
            <h4 style={{ color: '#1f2937', marginBottom: '10px' }}>Questions About This Invoice?</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
              Our billing support team is here to help with any questions.
            </p>
            <Button href="mailto:info@premierleaguetables.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Contact Billing Support
            </Button>
          </div>
        </Section>

        {/* Footer */}
        <Section className="footer">
          <p style={{ marginBottom: '15px' }}>
            This is an automated invoice from premierleaguetables.com
          </p>
          <p>© 2026 premierleaguetables.com. All rights reserved.</p>
          <p style={{ marginTop: '10px' }}>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Privacy</a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Terms</a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Billing Support</a>
          </p>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default InvoiceEmail;


