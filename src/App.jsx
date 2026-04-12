import { ToastProvider } from './shared/ui/ToastProvider';
import AppRouter from './app/AppRouter';

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;
