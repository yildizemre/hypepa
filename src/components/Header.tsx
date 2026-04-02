import { motion } from 'framer-motion';
import { Activity, Wifi, Camera, Search, Bell, FileDown, LogOut, User, EyeOff, Compass, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../contexts/AuthContext';
import { useTour } from '../contexts/TourContext';

const pageNames: Record<string, string> = {
  dashboard: 'Kontrol Paneli',
  feeds: 'Canlı Yayınlar',
  hse: 'İSG - Sağlık ve Güvenlik',
  yangin: 'Yangın İzleme',
  'alan-ihlali': 'Alan İhlali',
  'product-counting': 'Ürün Sayımı',
  module: 'Modül',
  'user-management': 'Kullanıcı Yönetimi',
  settings: 'Ayarlar',
};

const pageSubtitles: Record<string, string> = {
  dashboard: 'Orbitra Analitik',
  hse: 'Gerçek zamanlı güvenlik izleme ve analizler',
  yangin: 'Yangın algılama ve uyarı analizleri',
  'alan-ihlali': 'Kısıtlı alan ve güvenlik bölgesi ihlal analizleri',
  'product-counting': 'Ürün sayım raporları',
};

export default function Header() {
  const [latency, setLatency] = useState(12);
  const { currentPage, setMobileSidebarOpen } = useNavigation();
  const { user, viewAsUser, setViewAsUser, effectiveUser, logout } = useAuth();
  const { startTour } = useTour();

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(10 + Math.floor(Math.random() * 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-slate-200"
    >
        {viewAsUser && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-amber-800">
            <strong>{viewAsUser.username}</strong> kullanıcısı olarak görüntülüyorsunuz.
          </span>
          <button
            type="button"
            onClick={() => setViewAsUser(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-sm font-medium hover:bg-amber-200 transition-colors"
          >
            <EyeOff className="w-4 h-4" />
            Görüntülemeyi bitir
          </button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 flex-shrink-0"
            aria-label="Menüyü aç"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
            {pageNames[currentPage]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 truncate">{pageSubtitles[currentPage] ?? 'Orbitra Analitik'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {currentPage === 'hse' && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
              <FileDown className="w-4 h-4" />
              PDF olarak kaydet
            </button>
          )}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Ara..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full sm:w-48 lg:w-64"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
            {effectiveUser && (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2">
                <User className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{effectiveUser.username}</span>
                {viewAsUser && <span className="text-xs text-amber-600">(görüntüleme)</span>}
              </div>
            )}
            <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700 hidden sm:inline">Yapay Zeka Aktif</span>
            </div>

            <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Wifi className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-700">{latency}ms</span>
            </div>

            <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Camera className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-700">54</span>
            </div>

            <button
              type="button"
              onClick={startTour}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
              title="Site tanıtım turu"
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Site Turu</span>
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {user && (
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Çıkış Yap {effectiveUser !== user && `(${user.username})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
