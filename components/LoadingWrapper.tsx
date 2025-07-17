"use client";

import { useEffect, useState } from 'react';
import { SpaceLoading } from './SpaceLoading';

export const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500); // Small delay for smooth transition
          return 100;
        }
        // Random increment to make it look more natural
        const increment = Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <SpaceLoading progressd={progress} />;
  }

  return <>{children}</>;
};

export default LoadingWrapper;
