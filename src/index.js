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
import { ConfirmProvider } from 'material-ui-confirm';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3000,
    },
  },
})


axios.defaults.baseURL = process.env.REACT_APP_SERVER;


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <HelmetProvider>
    <BrowserRouter>

      <QueryClientProvider client={queryClient}>
        <AuthContext>
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </AuthContext>
      </QueryClientProvider>

    </BrowserRouter>
  </HelmetProvider>
);

serviceWorker.unregister();
// serviceWorker.register();

reportWebVitals();
