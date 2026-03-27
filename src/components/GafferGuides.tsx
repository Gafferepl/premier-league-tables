import React from 'react';
import OptimizedGuideSystem from './guides/OptimizedGuideSystem';

interface GafferGuidesProps {
  isOpen: boolean;
  onClose: () => void;
}

const GafferGuides: React.FC<GafferGuidesProps> = ({ isOpen, onClose }) => {
  return <OptimizedGuideSystem isOpen={isOpen} onClose={onClose} />;
};

export default GafferGuides;


