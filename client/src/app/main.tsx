import Store from './store/store';
import { createContext } from 'react';
interface State {
  store: Store;
}

export const store = new Store();
export const Context = createContext<State>({
  store,
});
import { createRoot } from 'react-dom/client';
import App from './App';
import '../index.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const container = document.getElementById('root'); // Get the root container element
if (container) {
  const root = createRoot(container); // Create a root for the React application
  root.render(
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
}
