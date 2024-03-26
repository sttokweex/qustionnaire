import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from '../features/loginForm/store/store';
import { QueryClient, QueryClientProvider } from 'react-query';

interface State {
  store: Store;
}
const queryClient = new QueryClient();
const store = new Store();
export const Context = createContext<State>({
  store,
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Context.Provider
        value={{
          store,
        }}
      >
        <App />
      </Context.Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
