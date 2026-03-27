
import React, { useState } from 'react';
import { Fixture } from '../../types';
import { generateNewsletterContent } from '../services/gemini';

interface NewsletterGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  fixtures: Fixture[];
}

const NewsletterGenerator: React.FC<NewsletterGeneratorProps> = ({ isOpen, onClose, fixtures }) => {
  const [loading, setLoading] = useState(false);
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const content = await generateNewsletterContent(fixtures);
    
    if (content) {
      const emailHtml = constructEmailHtml(content, fixtures.slice(0, 3));
      setHtmlOutput(emailHtml);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 w-full max-w-4xl h-[85vh] rounded-xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <div>
              <h3 className="text-white font-bold font-heading">The Gaffer's Briefing</h3>
              <p className="text-xs text-slate-400">Newsletter Generator v1.0</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar / Controls */}
          <div className="w-1/3 p-6 border-r border-slate-700 bg-slate-900 flex flex-col gap-6 overflow-y-auto">
            
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Status</h4>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className={`w-2 h-2 rounded-full ${fixtures.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {fixtures.length} Upcoming Fixtures Found
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-accent hover:bg-[#f50057] disabled:bg-slate-700 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magic"></i>}
              {loading ? 'Writing Banter...' : 'Generate Newsletter'}
            </button>

            {htmlOutput && (
              <div className="space-y-3">
                <div className="h-px bg-slate-700 w-full"></div>
                <button 
                  onClick={handleCopy}
                  className={`w-full py-3 border-2 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${copied ? 'border-green-500 text-green-500' : 'border-white/20 text-white hover:bg-white/10'}`}
                >
                  {copied ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
                  {copied ? 'Copied to Clipboard' : 'Copy HTML Code'}
                </button>
                <p className="text-[10px] text-slate-500 text-center">
                  Paste directly into Zoho Mail / Mailchimp "Code View".
                </p>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div className="w-2/3 bg-white relative">
            {htmlOutput ? (
              <iframe 
                srcDoc={htmlOutput} 
                className="w-full h-full border-none"
                title="Newsletter Preview"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                <i className="fas fa-file-code text-6xl mb-4 opacity-20"></i>
                <p className="font-mono text-sm">Waiting for generation...</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- THE EMAIL TEMPLATE BUILDER ---
const constructEmailHtml = (data: any, upcoming: Fixture[]) => {
  const { headline, intro, analysis, tip, verdict, match } = data;

  const rows = upcoming.map(f => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #334155;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="40%" align="right" style="color: #ffffff; font-weight: bold; font-family: sans-serif;">${f.homeTeam}</td>
            <td width="20%" align="center" style="color: #94a3b8; font-size: 12px; font-family: monospace;">VS</td>
            <td width="40%" align="left" style="color: #ffffff; font-weight: bold; font-family: sans-serif;">${f.awayTeam}</td>
          </tr>
          <tr>
            <td colspan="3" align="center" style="color: #cbd5e1; font-size: 10px; text-transform: uppercase; padding-top: 4px;">${f.date}</td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <center>
    <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0f172a">
      <tr>
        <td align="center" valign="top">
          <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            
            <!-- HEADER -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #1a237e 0%, #283593 100%); padding: 40px 20px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900;">The Gaffer's Briefing</h1>
                <p style="color: #ff4081; margin: 10px 0 0 0; font-size: 14px; font-weight: bold; text-transform: uppercase;">Weekly Intelligence Report</p>
              </td>
            </tr>

            <!-- INTRO -->
            <tr>
              <td style="padding: 40px 40px 20px 40px;">
                <h2 style="color: #ffffff; margin: 0 0 15px 0; font-size: 24px; line-height: 1.2;">${headline}</h2>
                <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0;">${intro}</p>
              </td>
            </tr>

            <!-- BIG MATCH ANALYSIS -->
            <tr>
              <td style="padding: 0 40px;">
                <div style="background-color: #0f172a; border-left: 4px solid #d4af37; padding: 20px; border-radius: 0 8px 8px 0;">
                  <p style="color: #d4af37; font-size: 12px; text-transform: uppercase; font-weight: bold; margin: 0 0 10px 0; letter-spacing: 1px;">Match of the Week</p>
                  <h3 style="color: #ffffff; margin: 0 0 10px 0; font-size: 20px;">${match.homeTeam} vs ${match.awayTeam}</h3>
                  <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0; font-style: italic;">"${analysis}"</p>
                  <table width="100%">
                    <tr>
                      <td style="border-top: 1px solid #334155; padding-top: 10px;">
                        <span style="color: #ffffff; font-weight: bold; font-size: 14px;">The Verdict:</span> 
                        <span style="color: #ff4081; font-weight: bold; font-size: 14px;">${verdict}</span>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <!-- FIXTURE LIST -->
            <tr>
              <td style="padding: 30px 40px;">
                <p style="color: #ffffff; font-size: 14px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #ff4081; display: inline-block; padding-bottom: 5px; margin-bottom: 20px;">Upcoming Fixtures</p>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  ${rows}
                </table>
              </td>
            </tr>

            <!-- THE TIP -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <div style="background-color: #1a472a; padding: 20px; border-radius: 8px; text-align: center;">
                  <p style="color: #fbbf24; margin: 0 0 5px 0; font-weight: bold; text-transform: uppercase; font-size: 12px;">The Gaffer's Golden Tip</p>
                  <p style="color: #ffffff; margin: 0; font-size: 18px; font-weight: bold;">${tip}</p>
                </div>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td align="center" style="background-color: #0f172a; padding: 30px; border-top: 1px solid #334155;">
                <p style="color: #64748b; font-size: 12px; margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} PremierLeagueTables.com</p>
                <p style="color: #64748b; font-size: 12px; margin: 0;">No VAR checks on this email. The decision is final.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
};

export default NewsletterGenerator;


