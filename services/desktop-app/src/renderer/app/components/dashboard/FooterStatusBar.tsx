'use client';

import { useEffect, useState } from 'react';

export function FooterStatusBar() {
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleString('sv-SE', { hour12: false }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('sv-SE', { hour12: false }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 bg-gray-100 border-t border-gray-200 flex items-center px-4 text-xs text-gray-600">
      <div className="flex items-center gap-4">
        <div>main.db</div>
        <div>SQLite 3.39.5</div>
        <div>7 rows selected</div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div>Query time: 0.002s</div>
        <div>Memory: 24.5 MB</div>
        <div>{currentTime}</div>
      </div>
    </div>
  );
}
