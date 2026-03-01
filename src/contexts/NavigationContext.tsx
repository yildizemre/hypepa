import { createContext, useContext, useState, ReactNode } from 'react';
import type { PageId } from '../config/menu';

type Page = PageId;
type HSESubPage = 'fire-detection' | 'ppe-compliance' | 'personnel-productivity' | 'other-analytics';

interface NavigationContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentSubModule: string | null;
  setCurrentSubModule: (id: string | null) => void;
  hseSubPage: HSESubPage;
  setHSESubPage: (subPage: HSESubPage) => void;
  /** Mobilde sol menü açık/kapalı (hamburger) */
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currentSubModule, setCurrentSubModule] = useState<string | null>(null);
  const [hseSubPage, setHSESubPage] = useState<HSESubPage>('fire-detection');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        currentSubModule,
        setCurrentSubModule,
        hseSubPage,
        setHSESubPage,
        mobileSidebarOpen,
        setMobileSidebarOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
