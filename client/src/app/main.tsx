import ReactDOM from 'react-dom/client';
import App from './App';
import '../index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Store from './store/store';
import { createContext } from 'react';

interface State {
  store: Store;
}

export const store = new Store();

export const Context = createContext<State>({
  store,
});
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Context.Provider
    value={{
      store,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Context.Provider>,
);
