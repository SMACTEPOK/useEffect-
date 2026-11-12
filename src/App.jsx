import React from 'react';
import Lab7Page from './pages/Lab7Page';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark">✱</span>
          CRAFTMARKET
          <span className="app__brand-tag">LAB 7</span>
        </div>
      </header>
      <main className="app__main">
        <Lab7Page />
      </main>
      <footer className="app__footer">
        <p>© 2026 CRAFTMARKET · Лабораторна робота 7 · useEffect</p>
      </footer>
    </div>
  );
}

export default App;
