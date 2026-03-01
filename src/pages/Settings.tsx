import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { User, Bell, Shield, Database, Monitor, Save } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-full min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0 overflow-x-hidden">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Ayarlar</h2>
            <p className="text-sm text-slate-500">Uygulama tercihlerinizi yönetin</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Profil Bilgileri</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Ad</label>
                      <input
                        type="text"
                        defaultValue="Admin"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Soyad</label>
                      <input
                        type="text"
                        defaultValue="Kullanıcı"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      defaultValue="admin@hypevision.com"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rol</label>
                    <select className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option>Yönetici</option>
                      <option>Müdür</option>
                      <option>Operatör</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-violet-50 rounded-lg">
                    <Bell className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Bildirimler</h3>
                </div>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <div className="font-medium text-slate-900 capitalize">
                          {key === 'email' ? 'E-posta' : key === 'push' ? 'Anlık Bildirim' : 'SMS'} Bildirimleri
                        </div>
                        <div className="text-sm text-slate-500">
                          {key === 'email' ? 'E-posta ile uyarı al' : key === 'push' ? 'Anlık bildirim al' : 'SMS ile uyarı al'}
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Monitor className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Görüntü Tercihleri</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Yenileme Sıklığı</label>
                    <select className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option>5 saniye</option>
                      <option>10 saniye</option>
                      <option>30 saniye</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kamera Kalitesi</label>
                    <select className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option>Yüksek (1080p)</option>
                      <option>Orta (720p)</option>
                      <option>Düşük (480p)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Güvenlik</h3>
                </div>

                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium text-slate-700">
                    Şifre Değiştir
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium text-slate-700">
                    İki Faktörlü Doğrulama
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium text-slate-700">
                    Aktif Oturumlar
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Database className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Veri</h3>
                </div>

                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium text-slate-700">
                    Veri Dışa Aktar
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium text-slate-700">
                    Ayarları Yedekle
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium text-red-600">
                    Önbelleği Temizle
                  </button>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Değişiklikleri Kaydet</span>
              </motion.button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
