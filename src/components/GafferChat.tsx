import React, { useState, useEffect, useRef } from 'react';
import { apiRotator } from '../utils/apiRotator';
import { getGafferPrompt, categorizeQuestion } from '../utils/gafferPrompts';
import { getGafferReply, trackQuickReplyUsage, getThinkingMessage, calculateTypingDelay } from '../utils/gafferReplies';

interface Message {
  id: string;
  role: 'user' | 'gaffer';
  content: string;
  timestamp: Date;
}

interface GafferChatProps {
  userEmail: string;
  userTier: 'free' | 'firstTeam' | 'seasonPass';
  userName?: string;
}

const GafferChat: React.FC<GafferChatProps> = ({ userEmail, userTier, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [thinkingMessage, setThinkingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check user's remaining questions
    const checkRemaining = () => {
      const canChat = apiRotator.canUserChat(userEmail, userTier);
      setRemaining(canChat.remaining);
    };
    checkRemaining();
  }, [userEmail, userTier, messages]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load chat history from localStorage
    const stored = localStorage.getItem(`chat_${userEmail}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    }
  }, [userEmail]);

  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem(`chat_${userEmail}`, JSON.stringify(msgs));
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Check if we can use a quick reply first
      const replyData = getGafferReply(input);
      
      // Show thinking message
      setThinkingMessage(getThinkingMessage());
      
      // Calculate delay based on reply type and length
      const delay = calculateTypingDelay(replyData.reply, !replyData.useAPI);
      
      // Simulate thinking/typing delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      if (!replyData.useAPI) {
        // Use quick reply - no API call needed
        const gafferMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'gaffer',
          content: replyData.reply,
          timestamp: new Date()
        };
        const updatedMessages = [...newMessages, gafferMessage];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setThinkingMessage(''); // Clear thinking message
        
        // Track quick reply usage for analytics
        trackQuickReplyUsage(replyData.category || 'unknown', input);
        return;
      }

      // Use API for complex questions
      const questionType = categorizeQuestion(input);
      const prompt = getGafferPrompt(input, questionType);

      // Make API request with original question for caching
      const result = await apiRotator.makeRequest(prompt, userEmail, userTier, input);

      if (result.success && result.response) {
        const gafferMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'gaffer',
          content: result.response,
          timestamp: new Date()
        };
        const updatedMessages = [...newMessages, gafferMessage];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'gaffer',
          content: result.error || 'Sorry, something went wrong. Try again.',
          timestamp: new Date()
        };
        const updatedMessages = [...newMessages, errorMessage];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
      }
    } catch (error) {
      // console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'gaffer',
        content: 'Technical issues on my end. Give it another go.',
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } finally {
      setIsLoading(false);
      setThinkingMessage(''); // Clear thinking message
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(`chat_${userEmail}`);
  };

  // Free user upgrade prompt
  if (userTier === 'free') {
    return (
      <>
        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Chat with The Gaffer"
        >
          <i className="fas fa-comments text-2xl group-hover:scale-110 transition-transform"></i>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
            <i className="fas fa-lock text-xs text-slate-900"></i>
          </div>
        </button>

        {/* Upgrade Prompt Window */}
        {isOpen && (
          <div className="fixed bottom-24 right-6 z-50 w-96 bg-slate-800 rounded-2xl shadow-2xl border-2 border-red-500/50 overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <i className="fas fa-times text-white"></i>
              </button>
              
              <div className="flex items-center gap-3">
                <img src="/gaffer-icon.png" alt="The Gaffer" className="w-12 h-12 rounded-full border-2 border-white/50" />
                <div>
                  <h3 className="text-white font-bold text-lg">Ask The Gaffer</h3>
                  <p className="text-red-100 text-sm">Premium Feature</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-xl p-4 mb-4">
                <h4 className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
                  <i className="fas fa-crown"></i>
                  Upgrade to Chat with The Gaffer
                </h4>
                <p className="text-yellow-100 text-sm mb-3">
                  Get instant FPL advice 24/7 from The Gaffer's AI assistant!
                </p>
                <ul className="text-yellow-100 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-400 mt-0.5"></i>
                    <span>Instant transfer recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-400 mt-0.5"></i>
                    <span>Captain pick advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-400 mt-0.5"></i>
                    <span>Injury & fixture analysis</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('selectTier', { detail: 'firstTeam' }));
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  <i className="fas fa-star mr-2"></i>
                  First Team - 10 questions/day
                </button>
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('selectTier', { detail: 'seasonPass' }));
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  <i className="fas fa-crown mr-2"></i>
                  Season Pass - Unlimited
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Paid user chat interface
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Chat with The Gaffer"
      >
        <i className="fas fa-comments text-2xl group-hover:scale-110 transition-transform"></i>
        {remaining > 0 && remaining < 999 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-slate-900">{remaining}</span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-slate-800 rounded-2xl shadow-2xl border-2 border-red-500/50 overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <i className="fas fa-times text-white"></i>
            </button>
            
            <div className="flex items-center gap-3">
              <img src="/gaffer-icon.png" alt="The Gaffer" className="w-12 h-12 rounded-full border-2 border-white/50" />
              <div>
                <h3 className="text-white font-bold text-lg">The Gaffer</h3>
                <div className="flex items-center gap-2">
                  {userTier === 'seasonPass' ? (
                    <div className="flex items-center gap-2">
                      <i className="fas fa-crown text-[#d4af37] text-xs animate-pulse"></i>
                      <p className="text-red-100 text-sm font-medium">Unlimited Pro Access</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <i className="fas fa-crown text-[#d4af37] text-xs animate-pulse"></i>
                      <p className="text-red-100 text-sm font-medium">
                        Free preview • {remaining} questions this month • Go unlimited with Pro
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-900">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <img src="/gaffer-icon.png" alt="The Gaffer" className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-red-500/50" />
                <p className="text-slate-400 text-sm mb-2">
                  Ey up Sunshine! How can I Help?
                </p>
                <p className="text-slate-500 text-xs">
                  Ask about transfers, captains, fixtures, or anything FPL!
                </p>
              </div>
            )}

            {/* Thinking Message */}
            {thinkingMessage && (
              <div className="flex items-start gap-3 animate-pulse">
                <img src="/gaffer-icon.png" alt="The Gaffer" className="w-8 h-8 rounded-full border-2 border-red-500/50 flex-shrink-0" />
                <div className="flex-1">
                  <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-blue-400 text-sm font-medium italic">{thinkingMessage}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-white border border-red-500/30'
                  }`}
                >
                  {message.role === 'gaffer' && (
                    <div className="flex items-center gap-2 mb-1">
                      <img src="/gaffer-icon.png" alt="The Gaffer" className="w-5 h-5 rounded-full" />
                      <span className="text-yellow-400 text-xs font-bold">THE GAFFER</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-white border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <img src="/gaffer-icon.png" alt="The Gaffer" className="w-5 h-5 rounded-full" />
                    <span className="text-yellow-400 text-xs font-bold">THE GAFFER</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700 bg-slate-800">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-slate-400 hover:text-red-400 mb-2 flex items-center gap-1"
              >
                <i className="fas fa-trash"></i>
                Clear chat
              </button>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask The Gaffer..."
                disabled={isLoading || remaining === 0}
                className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || remaining === 0}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>

            {remaining === 0 && userTier === 'firstTeam' && (
              <p className="text-xs text-yellow-400 mt-2 text-center">
                Daily limit reached. <button
                  onClick={() => window.dispatchEvent(new CustomEvent('selectTier', { detail: 'seasonPass' }))}
                  className="underline hover:text-yellow-300"
                >
                  Upgrade to Season Pass
                </button> for unlimited chat!
              </p>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default GafferChat;


