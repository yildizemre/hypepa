import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getModuleInfo } from '../config/menu';
import { getImageForModule } from '../config/images';
import { useNavigation } from '../contexts/NavigationContext';
import { Bell, ArrowLeft, Camera, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/** Modül ID'ye göre farklı sayılar üret (her sayfa farklı veri) */
function getModuleStats(moduleId: string | null) {
  if (!moduleId) return { cameras: 0, today: 0, active: 0, accuracy: 0 };
  const n = moduleId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    cameras: 8 + (n % 7),
    today: 5 + (n % 14),
    active: (n % 3),
    accuracy: 92 + (n % 7),
  };
}

function getModuleChartData(moduleId: string | null) {
  const n = moduleId ? moduleId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  return hours.map((hour, i) => ({ hour, count: (n + i * 3) % 5 }));
}

function getModuleEvents(moduleId: string | null) {
  const cams = ['CAM-002', 'CAM-005', 'CAM-008', 'CAM-011', 'CAM-014', 'CAM-017'];
  const n = moduleId ? moduleId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
  return [
    { cameraId: cams[n % 6], time: '15:22', status: n % 2 === 0 ? 'Aktif' : 'Çözüldü' },
    { cameraId: cams[(n + 1) % 6], time: '14:10', status: 'Çözüldü' },
    { cameraId: cams[(n + 2) % 6], time: '13:45', status: n % 3 === 0 ? 'Aktif' : 'Çözüldü' },
    { cameraId: cams[(n + 3) % 6], time: '12:18', status: 'Çözüldü' },
  ];
}

/** Her modül sayfasında tam 2 bildirim (modül görseli ile) */
function getModuleNotifications(moduleId: string, moduleLabel: string, imageUrl: string) {
  const n = moduleId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return [
    { title: `${moduleLabel} tespiti`, description: `Kamera görüntüsünde olay kaydedildi. CAM-${String((n % 9) + 1).padStart(2, '0')}`, time: '12 dk önce', image: imageUrl },
    { title: `${moduleLabel} uyarısı`, description: `Önceki vardiyada 1 olay çözüldü.`, time: '1 saat önce', image: imageUrl },
  ];
}

export default function ModulePage() {
  const { currentSubModule } = useNavigation();
  const moduleInfo = currentSubModule ? getModuleInfo(currentSubModule) : null;
  const [notifyOn, setNotifyOn] = useState(true);
  const moduleImage = currentSubModule ? getImageForModule(currentSubModule) : null;
  const stats = getModuleStats(currentSubModule || null);
  const chartData = getModuleChartData(currentSubModule || null);
  const events = getModuleEvents(currentSubModule || null);
  const moduleNotifications = getModuleNotifications(currentSubModule!, moduleInfo.labelTr, moduleImage!);

  if (!moduleInfo) {
    return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col lg:flex-row w-full">
      <Sidebar />
        <div className="flex-1 flex flex-col min-h-full min-w-0">
          <Header />
          <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center text-slate-500 min-w-0">
            Bir modül seçin.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col lg:flex-row w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-full min-w-0">
        <Header />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-6 items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">{moduleInfo.labelTr}</h1>
                <p className="text-slate-600">{moduleInfo.description || 'Görüntü işleme ile analiz ve bildirim modülü.'}</p>
              </div>
              {moduleImage && (
                <img
                  src={moduleImage}
                  alt=""
                  className="w-40 h-28 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                />
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Aktif Kamera</p>
                <p className="text-2xl font-bold text-slate-900">{stats.cameras}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Bugün Tespit</p>
                <p className="text-2xl font-bold text-slate-900">{stats.today}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Aktif Uyarı</p>
                <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Doğruluk</p>
                <p className="text-2xl font-bold text-slate-900">%{stats.accuracy}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Saatlik Analiz (Görüntü İşleme)
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Tespit" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Son 2 Bildirim
                </h3>
                <div className="space-y-3">
                  {moduleNotifications.map((notif, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <img src={notif.image} alt="" className="w-16 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{notif.title}</p>
                        <p className="text-xs text-slate-600 truncate">{notif.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-4">Bu modül için kamera tespitlerinde anlık bildirim alın.</p>
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={notifyOn}
                    onChange={(e) => setNotifyOn(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Bu modül için bildirim al</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Son Tespitler (Kamera ve Olay Anı)
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Hangi kamera, saat ve görüntü işleme sonucu.
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Kamera</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Saat</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Olay Anı Görüntüsü</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4 font-mono text-sm font-medium text-slate-900">{e.cameraId}</td>
                        <td className="py-4 px-4 text-slate-600">{e.time}</td>
                        <td className="py-4 px-4">
                          <img
                            src={moduleImage || ''}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              e.status === 'Aktif' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-sm text-slate-500 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Sol menüden diğer modüllere geçebilirsiniz.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
