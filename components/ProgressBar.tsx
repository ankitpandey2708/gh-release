'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export function ProgressBar({ loading }: { loading: boolean }) {
  useEffect(() => {
    if (!loading) return;
    NProgress.start();
    // Also runs on unmount, so the bar never outlives the load that started it.
    return () => {
      NProgress.done();
    };
  }, [loading]);

  return null;
}
