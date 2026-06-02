
import App from './App'
import './index.css'
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';

const container = document.getElementById('root');
const root = createRoot(container) 
root.render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
);