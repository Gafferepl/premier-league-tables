'use client';

import { useState } from 'react';

const emails = [
  { 
    id: 'free-welcome', 
    name: 'Free Welcome Email', 
    description: 'Sent to new free users',
    icon: '👋'
  },
  { 
    id: 'paid-welcome', 
    name: 'Paid Welcome Email', 
    description: 'Sent to new premium subscribers',
    icon: '👑'
  },
  { 
    id: 'assessment', 
    name: 'Team Assessment Email', 
    description: 'Weekly team analysis for premium users',
    icon: '🏆'
  },
  { 
    id: 'thank-you', 
    name: 'Thank You Email', 
    description: 'Payment confirmation for first payment',
    icon: '✅'
  },
  { 
    id: 'payment-failed', 
    name: 'Payment Failed Email', 
    description: 'Sent when payment processing fails',
    icon: '⚠️'
  },
  { 
    id: 'cancellation', 
    name: 'Cancellation Email', 
    description: 'Sent when user cancels subscription',
    icon: '😔'
  },
  { 
    id: 'unsubscribe', 
    name: 'Unsubscribe Confirmation', 
    description: 'Sent when user unsubscribes from marketing',
    icon: '📧'
  },
];

export default function EmailPreviewPage() {
  const [selectedEmail, setSelectedEmail] = useState(emails[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const handleEmailSelect = (email: typeof emails[0]) => {
    setSelectedEmail(email);
    setIsLoading(true);
    setIframeKey(prev => prev + 1); // Force iframe reload
    
    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '320px', 
        background: '#f8fafc', 
        padding: '20px', 
        overflow: 'auto',
        borderRight: '1px solid #e5e7eb'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📧 PL Hub Email Templates
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
            Click any template to preview. All emails are fully responsive and branded.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#6b7280', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '12px'
          }}>
            Available Templates
          </h3>
        </div>

        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => handleEmailSelect(email)}
            style={{
              display: 'block',
              width: '100%',
              padding: '16px',
              marginBottom: '8px',
              background: selectedEmail.id === email.id 
                ? 'linear-gradient(135deg, #1e40af, #3b82f6)' 
                : 'white',
              color: selectedEmail.id === email.id ? 'white' : '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: selectedEmail.id === email.id 
                ? '0 4px 12px rgba(30, 64, 175, 0.2)' 
                : '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              if (selectedEmail.id !== email.id) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedEmail.id !== email.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                fontSize: '24px',
                filter: selectedEmail.id === email.id ? 'brightness(1.2)' : 'none'
              }}>
                {email.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600', 
                  fontSize: '14px',
                  marginBottom: '2px'
                }}>
                  {email.name}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  opacity: selectedEmail.id === email.id ? 0.9 : 0.7,
                  lineHeight: '1.4'
                }}>
                  {email.description}
                </div>
              </div>
            </div>
          </button>
        ))}

        <div style={{ 
          marginTop: '30px', 
          padding: '16px', 
          background: '#f0f9ff', 
          borderRadius: '12px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <h4 style={{ 
            color: '#1e3a8a', 
            fontSize: '14px', 
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            💡 Pro Tip
          </h4>
          <p style={{ 
            color: '#1e3a8a', 
            fontSize: '12px', 
            lineHeight: '1.5',
            margin: 0
          }}>
            Use browser dev tools (Ctrl+Shift+M) to test responsive design on different screen sizes.
          </p>
        </div>
      </div>

      {/* Preview Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)', 
          color: 'white', 
          padding: '20px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedEmail.icon} {selectedEmail.name}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              {selectedEmail.description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                const iframe = document.querySelector('iframe') as HTMLIFrameElement;
                if (iframe) {
                  iframe.contentWindow?.print();
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              🖨️ Print
            </button>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = `/api/emails/preview?template=${selectedEmail.id}&password=ellerkerdavid@gmail.com`;
                link.download = `${selectedEmail.id}.html`;
                link.click();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              📥 Download
            </button>
          </div>
        </div>
        
        {/* Email Preview */}
        <div style={{ 
          flex: 1, 
          padding: '20px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isLoading && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading template...</p>
            </div>
          )}
          
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            height: isLoading ? '0' : 'calc(100vh - 180px)',
            width: '100%',
            maxWidth: '800px',
            overflow: 'hidden',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}>
            <iframe
              key={iframeKey}
              src={`/api/emails/preview?template=${selectedEmail.id}&password=ellerkerdavid@gmail.com`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '12px'
              }}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


