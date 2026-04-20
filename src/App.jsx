import { ToastProvider } from './shared/ui/ToastProvider';
import AppRouter from './app/AppRouter';
import { BusyProvider } from './shared/ui/BusyProvider';

function App() {
  return (
    <BusyProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </BusyProvider>
  );
}

export default App;
