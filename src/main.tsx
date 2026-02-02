import { createRoot } from 'react-dom/client';
import './styles/global.css'; // Import global styles
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <App />
);