// main.tsx (updated)
import ReactDOM from 'react-dom/client'
import "reflect-metadata";
// @ts-ignore
import './styles/index.css';
// @ts-ignore
import './styles/calendar.css';
// @ts-ignore
import './styles/landing.css';
// @ts-ignore
import './styles/custom.css';
import React from 'react';
import ConditionalRouter from './components/Shared/ConditionalRouter';
import App from './routes/App';
import { SettingsProvider } from './contexts/SettingsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <ConditionalRouter>
        <App />
      </ConditionalRouter>
    </SettingsProvider>
  </React.StrictMode>,
)