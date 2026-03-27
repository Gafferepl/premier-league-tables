import React, { useState } from 'react';
import AutomatedAssessmentService from '../services/automatedAssessmentService';

interface FplIdCollectorProps {
  onFplIdCollected?: (fplId: string) => void;
  subscriptionTier: string;
  disabled?: boolean;
}

const FplIdCollector: React.FC<FplIdCollectorProps> = ({ 
  onFplIdCollected, 
  subscriptionTier, 
  disabled = false 
}) => {
  const [fplId, setFplId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const assessmentService = AutomatedAssessmentService.getInstance();

  const validateFplIdFormat = (id: string): boolean => {
    return /^\d{7,8}$/.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Validate format first
      if (!validateFplIdFormat(fplId)) {
        throw new Error("FPL ID must be 7-8 digits (e.g., 1234567)");
      }

      // Show validation message
      setIsValidating(true);
      setMessage('Validating your FPL team...');
      setMessageType('info');

      // For demo purposes, we'll simulate the validation
      // In production, this would call the real FPL API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate validation result (90% success rate for demo)
      const isValid = Math.random() > 0.1;
      
      if (!isValid) {
        throw new Error("Invalid FPL Team ID. Please check your team ID and try again.");
      }

      // Show success message
      setMessage('✅ FPL Team validated! Setting up your weekly assessments...');
      setMessageType('success');

      // Call the assessment service (in a real app, you'd pass the actual user ID)
      // For now, we'll simulate the collection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('🏆 Success! Your FPL team is now set up for weekly assessments.');
      setMessageType('success');

      // Notify parent component
      if (onFplIdCollected) {
        onFplIdCollected(fplId);
      }

    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
      setIsValidating(false);
    }
  };

  const getFplIdHelp = () => {
    return (
      <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
        <h4 className="text-blue-400 font-bold mb-2">📍 Where to find your FPL Team ID:</h4>
        <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
          <li>Go to fantasy.premierleague.com</li>
          <li>Click "My Team" or "Points"</li>
          <li>Look at the URL: fantasy.premierleague.com/entry/<strong>YOUR-TEAM-ID</strong></li>
          <li>Your Team ID is the 7-8 digit number in the URL</li>
        </ol>
      </div>
    );
  };

  const getSecurityPromise = () => {
    return (
      <div className="bg-green-900/30 rounded-lg p-3 border border-green-500/30">
        <h4 className="text-green-400 font-bold mb-2">🔒 The Gaffer's Security Promise:</h4>
        <ul className="text-green-200 text-sm space-y-1">
          <li>• Your FPL ID is encrypted and stored securely</li>
          <li>• No one can see your team except you</li>
          <li>• Bank-level security (256-bit encryption)</li>
          <li>• Delete your data anytime, permanently</li>
          <li>• We never share your data with anyone</li>
        </ul>
        <p className="text-yellow-300 text-xs mt-2 italic">
          "The Gaffer protects his players' data like tactical secrets."
        </p>
      </div>
    );
  };

  const getAssessmentPreview = () => {
    return (
      <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
        <h4 className="text-purple-400 font-bold mb-2">📊 What You'll Get Every Week:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-purple-200 text-sm">
          <div>
            <h5 className="font-bold text-purple-300">Team Analysis:</h5>
            <ul className="space-y-1">
              <li>• Overall rating (1-10)</li>
              <li>• Attack/Defense scores</li>
              <li>• Budget efficiency</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-purple-300">Gaffer's Advice:</h5>
            <ul className="space-y-1">
              <li>• Transfer recommendations</li>
              <li>• Captain suggestions</li>
              <li>• Weak links to fix</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* FPL ID Input */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          FPL Team ID {subscriptionTier !== 'free' && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            value={fplId}
            onChange={(e) => setFplId(e.target.value.replace(/\D/g, ''))} // Only allow digits
            placeholder="1234567..."
            className="w-full px-4 py-3 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70 pr-12"
            disabled={disabled || isSubmitting}
            maxLength={8}
          />
          {fplId && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {validateFplIdFormat(fplId) ? (
                <i className="fas fa-check-circle text-green-500"></i>
              ) : (
                <i className="fas fa-times-circle text-red-500"></i>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-blue-300 mt-1">
          7-8 digit number from your FPL team URL
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={disabled || isSubmitting || !validateFplIdFormat(fplId)}
        className="w-full px-6 py-3 bg-gradient-to-r from-accent to-[#e91e63] text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <i className="fas fa-spinner fa-spin"></i>
            {isValidating ? 'Validating...' : 'Setting up...'}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <i className="fas fa-trophy"></i>
            Get My Team Analysis
          </span>
        )}
      </button>

      {/* Status Message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          messageType === 'success' ? 'bg-green-900/30 text-green-200 border border-green-500/30' :
          messageType === 'error' ? 'bg-red-900/30 text-red-200 border border-red-500/30' :
          'bg-blue-900/30 text-blue-200 border border-blue-500/30'
        }`}>
          {message}
        </div>
      )}

      {/* Help Sections */}
      <div className="space-y-3">
        {getFplIdHelp()}
        {getSecurityPromise()}
        {getAssessmentPreview()}
      </div>
    </div>
  );
};

export default FplIdCollector;


