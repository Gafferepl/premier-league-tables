import React from 'react';

interface Props {
  children: React.ReactNode;
}

// Simple performance optimizer that just renders children
const PerformanceOptimizerSimple: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default PerformanceOptimizerSimple;


