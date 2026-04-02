import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  ChevronDown,
  AlertTriangle,
  Shield,
  MapPin,
  HardHat,
  Truck,
  Activity,
  Store,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { menuSections } from '../config/menu';

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  emergency: AlertTriangle,
  'area-object': MapPin,
  ppe: HardHat,
  vehicle: Truck,
  behavioral: Activity,
  pandemic: Shield, // Pandemi kontrolleri
  retail: Store,
};

function getSectionIdForPage(currentPage: string, currentSubModule: string | null): string | null {
  if (currentPage === 'dashboard' || currentPage === 'settings' || currentPage === 'user-management') return null;
  for (const section of menuSections) {
    for (const item of section.items) {
      if (item.pageId && currentPage === item.pageId) return section.id;
      if (currentPage === 'module' && item.id === currentSubModule) return section.id;
    }
  }
  return null;
}

function isItemActive(
  item: (typeof menuSections)[0]['items'][0],
  currentPage: string,
  currentSubModule: string | null
): boolean {
  if (item.pageId) return currentPage === item.pageId && !currentSubModule;
  return currentPage === 'module' && currentSubModule === item.id;
}

export default function Sidebar() {
  const { effectiveUser, logout } = useAuth();
  const { currentPage, setCurrentPage, currentSubModule, setCurrentSubModule, mobileSidebarOpen, setMobileSidebarOpen } = useNavigation();
  const isAdmin = effectiveUser?.role === 'admin';

  const closeMobile = () => setMobileSidebarOpen(false);

  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(new Set());

  const activeSectionId = getSectionIdForPage(currentPage, currentSubModule);
  useEffect(() => {
    if (activeSectionId && !openSectionIds.has(activeSectionId)) {
      setOpenSectionIds((prev) => new Set(prev).add(activeSectionId));
    }
  }, [activeSectionId]);

  const toggleSection = (sectionId: string) => {
    setOpenSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const handleItemClick = (item: (typeof menuSections)[0]['items'][0]) => {
    if (item.pageId) {
      setCurrentPage(item.pageId);
      setCurrentSubModule(null);
    } else {
      setCurrentPage('module');
      setCurrentSubModule(item.id);
    }
    closeMobile();
  };

  const sidebarContent = (
    <>
      <div className="flex-shrink-0 px-3 flex items-center justify-between lg:justify-center">
        <motion.div whileHover={{ scale: 1.02 }} className="flex-1 flex justify-center lg:flex-none">
          <img src="/orbitralogo.png" alt="Orbitra" className="h-10 w-auto object-contain" />
        </motion.div>
        <button
          type="button"
          onClick={closeMobile}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          aria-label="Menüyü kapat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-1 px-2 mt-4 sm:mt-6">
        <motion.button
          data-tour="dashboard-link"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setCurrentPage('dashboard'); setCurrentSubModule(null); closeMobile(); }}
          className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
            currentPage === 'dashboard'
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {currentPage === 'dashboard' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-blue-50 rounded-xl"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <LayoutDashboard className="w-5 h-5 flex-shrink-0 relative z-10" />
          <span className="text-sm font-medium relative z-10">Kontrol Paneli</span>
        </motion.button>

        {menuSections.map((section) => {
          const isOpen = openSectionIds.has(section.id);
          const Icon = sectionIcons[section.id] ?? Shield;
          return (
            <div key={section.id} className="pt-1">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all ${
                  activeSectionId === section.id ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium text-left break-words leading-snug" title={section.titleTr}>
                    {section.titleTr}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-5 mt-1 space-y-0.5 border-l-2 border-slate-200 ml-3">
                      {section.items.map((item) => {
                        const active = isItemActive(item, currentPage, currentSubModule);
                        return (
                          <motion.button
                            key={item.id}
                            whileHover={{ x: 2 }}
                            onClick={() => handleItemClick(item)}
                            className={`w-full flex items-center gap-2 py-2 px-2 rounded-lg text-left transition-colors ${
                              active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <span className="text-sm font-medium text-left break-words leading-snug flex-1 min-w-0" title={item.labelTr}>
                              {item.labelTr}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setCurrentPage('user-management'); setCurrentSubModule(null); closeMobile(); }}
            className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              currentPage === 'user-management'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {currentPage === 'user-management' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-50 rounded-xl"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Users className="w-5 h-5 flex-shrink-0 relative z-10" />
            <span className="text-sm font-medium relative z-10">Kullanıcı Yönetimi</span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setCurrentPage('settings'); setCurrentSubModule(null); closeMobile(); }}
          className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
            currentPage === 'settings'
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {currentPage === 'settings' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-blue-50 rounded-xl"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <Settings className="w-5 h-5 flex-shrink-0 relative z-10" />
          <span className="text-sm font-medium relative z-10">Ayarlar</span>
        </motion.button>
      </div>

      <div className="flex-shrink-0 pt-4 border-t border-slate-100 px-3 mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Çıkış Yap</span>
        </motion.button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobil: arka plan karartma */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-slate-900/60 z-[45] lg:hidden"
            aria-hidden
          />
        )}
      </AnimatePresence>
      {/* Sidebar: mobilde sabit drawer, masaüstünde akışta */}
      <div
        data-tour="sidebar"
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[min(85vw,320px)]
          transition-[transform] duration-200 ease-out
          lg:static lg:top-auto lg:left-auto lg:bottom-auto lg:z-auto lg:w-64 xl:w-72 lg:max-w-none
          flex-shrink-0 bg-white border-r border-slate-200 flex flex-col min-h-full py-4 sm:py-6
          shadow-xl lg:shadow-none
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {sidebarContent}
      </div>
    </>
  );
}
