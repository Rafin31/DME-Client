import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios'
import { QueryClient, QueryClientProvider } from 'react-query';

//
import './index.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import { AuthContext } from './Context/AuthContext';


const queryClient = new QueryClient()
axios.defaults.baseURL = process.env.server;


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <HelmetProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContext>
          <App />
        </AuthContext>
      </QueryClientProvider>
    </BrowserRouter>
  </HelmetProvider>
);

serviceWorker.unregister();
// serviceWorker.register();

reportWebVitals();
