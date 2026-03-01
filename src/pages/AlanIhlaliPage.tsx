import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AlertFilterBar from '../components/AlertFilterBar';
import NotificationPanel from '../components/NotificationPanel';
import { images } from '../config/images';
import { MapPin, AlertTriangle, Camera, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const violationRecords = [
  { cameraId: 'CAM-012', zone: 'Tehlikeli Bölge A', time: '15:42:33', status: 'Aktif', thumb: images.area.restricted },
  { cameraId: 'CAM-005', zone: 'Girilmez Alan', time: '14:20:11', status: 'Çözüldü', thumb: images.area.warehouse },
  { cameraId: 'CAM-008', zone: 'Depo İçi Kısıtlı', time: '13:15:00', status: 'Çözüldü', thumb: images.area.warehouse },
  { cameraId: 'CAM-003', zone: 'Üretim Kısıtlı', time: '12:48:22', status: 'Çözüldü', thumb: images.area.restricted },
  { cameraId: 'CAM-017', zone: 'Yükleme Alanı', time: '11:33:09', status: 'Aktif', thumb: images.area.warehouse },
  { cameraId: 'CAM-009', zone: 'Girilmez Alan', time: '10:15:44', status: 'Çözüldü', thumb: images.area.restricted },
];

const hourlyViolations = [
  { hour: '08:00', count: 0 },
  { hour: '09:00', count: 1 },
  { hour: '10:00', count: 1 },
  { hour: '11:00', count: 1 },
  { hour: '12:00', count: 1 },
  { hour: '13:00', count: 1 },
  { hour: '14:00', count: 1 },
  { hour: '15:00', count: 2 },
];

export default function AlanIhlaliPage() {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col lg:flex-row w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-full min-w-0">
        <Header />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Alan İhlali</h1>
            <p className="text-slate-600">
              Görüntü işleme ile girilmez / kısıtlı alan ihlali tespiti. Hangi kamera ve olay anı görüntüsü aşağıda.
            </p>
          </div>

          <AlertFilterBar />
          <div className="mb-8">
            <NotificationPanel defaultFilter="alan-ihlali-only" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Aktif İhlal</p>
                    <p className="text-3xl font-bold text-slate-900">2</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Şu anda</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Bugün Toplam</p>
                    <p className="text-3xl font-bold text-slate-900">11</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Son 24 saat</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Çözülen</p>
                    <p className="text-3xl font-bold text-slate-900">9</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Başarılı</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Saatlik İhlal Dağılımı</h3>
                <p className="text-sm text-slate-500 mb-2">Kamera bazlı tespit sayısı</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={hourlyViolations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" name="İhlal" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center">
                <img
                  src={images.area.restricted}
                  alt="Alan ihlali izleme"
                  className="w-full h-48 object-cover rounded-xl border border-slate-200"
                />
                <p className="text-sm text-slate-500 mt-3">Kısıtlı alan — Görüntü işleme ile tespit</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Alan İhlali Kayıtları (Olay Anı Görüntüsü)</h3>
              <p className="text-sm text-slate-500 mb-4">Hangi kamera, bölge ve analiz görüntüsü.</p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Kamera</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Bölge</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Saat</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Olay Anı Görüntüsü</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Durum</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {violationRecords.map((r, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-blue-600" />
                            <span className="font-mono text-sm font-medium text-slate-900">{r.cameraId}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-700">{r.zone}</td>
                        <td className="py-4 px-4 text-slate-600">{r.time}</td>
                        <td className="py-4 px-4">
                          <img
                            src={r.thumb}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover border-2 border-slate-200"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              r.status === 'Aktif' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                            Detay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
