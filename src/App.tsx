import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { TourProvider, useTour } from './contexts/TourContext';
import ProductTour from './components/ProductTour';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HSE from './pages/HSE';
import YanginPage from './pages/YanginPage';
import AlanIhlaliPage from './pages/AlanIhlaliPage';
import ProductCounting from './pages/ProductCounting';
import UserManagementPage from './pages/UserManagementPage';
import Settings from './pages/Settings';
import ModulePage from './pages/ModulePage';

function TourAutoStart() {
  const { currentPage } = useNavigation();
  const { startTour, hasCompletedTour, isActive } = useTour();
  useEffect(() => {
    if (currentPage === 'dashboard' && !hasCompletedTour && !isActive) {
      const t = setTimeout(startTour, 500);
      return () => clearTimeout(t);
    }
  }, [currentPage, hasCompletedTour, isActive, startTour]);
  return null;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { currentPage } = useNavigation();

  if (!isAuthenticated) {
    return <Login />;
  }

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'hse':
      return <HSE />;
    case 'yangin':
      return <YanginPage />;
    case 'alan-ihlali':
      return <AlanIhlaliPage />;
    case 'product-counting':
      return <ProductCounting />;
    case 'module':
      return <ModulePage />;
    case 'user-management':
      return <UserManagementPage />;
    case 'settings':
      return <Settings />;
    default:
      return <Dashboard />;
  }
}

function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <TourProvider>
          <TourAutoStart />
          <AppContent />
          <ProductTour />
        </TourProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;
