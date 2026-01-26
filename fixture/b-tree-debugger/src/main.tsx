import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const rootElement = document.querySelector<HTMLDivElement>('#app');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <main className="shell">
      <h1>B-Tree Debugger</h1>
      <p>React Vite fixture is wired. Replace this with the debugger UI.</p>
    </main>
  );
}
