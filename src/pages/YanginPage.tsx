import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AlertFilterBar from '../components/AlertFilterBar';
import NotificationPanel from '../components/NotificationPanel';
import { images } from '../config/images';
import { Flame, AlertTriangle, CheckCircle, Thermometer, Camera } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const alarmRecords = [
  { region: 'Depo A', time: '14:32:11', type: 'Duman', status: 'Çözüldü', cameraId: 'CAM-002', thumb: images.fire.smoke },
  { region: 'Üretim B', time: '11:08:22', type: 'Isı', status: 'Çözüldü', cameraId: 'CAM-005', thumb: images.fire.depot },
  { region: 'Montaj', time: '09:45:00', type: 'Duman', status: 'Çözüldü', cameraId: 'CAM-003', thumb: images.fire.alarm },
  { region: 'Paketleme', time: '08:12:33', type: 'Isı', status: 'Çözüldü', cameraId: 'CAM-008', thumb: images.fire.extinguisher },
  { region: 'Depo B', time: '07:55:18', type: 'Duman', status: 'Çözüldü', cameraId: 'CAM-011', thumb: images.fire.smoke },
  { region: 'Kalite', time: '06:30:44', type: 'Duman', status: 'Aktif', cameraId: 'CAM-014', thumb: images.fire.depot },
];

const hourlyAlarms = [
  { hour: '06:00', alarm: 1 },
  { hour: '07:00', alarm: 1 },
  { hour: '08:00', alarm: 1 },
  { hour: '09:00', alarm: 1 },
  { hour: '10:00', alarm: 0 },
  { hour: '11:00', alarm: 1 },
  { hour: '12:00', alarm: 0 },
  { hour: '13:00', alarm: 0 },
  { hour: '14:00', alarm: 1 },
  { hour: '15:00', alarm: 0 },
];

export default function YanginPage() {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col lg:flex-row w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-full min-w-0">
        <Header />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Yangın İzleme</h1>
            <p className="text-slate-600">
              Kamera ve ısı sensörleri ile yangın/duman algılama. Hangi kamera, hangi bölge ve analiz sonuçları aşağıda.
            </p>
          </div>

          <AlertFilterBar />
          <div className="mb-8">
            <NotificationPanel defaultFilter="yangin-only" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <Flame className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Aktif Alarm</p>
                    <p className="text-3xl font-bold text-slate-900">1</p>
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
                    <p className="text-3xl font-bold text-slate-900">7</p>
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
                    <p className="text-3xl font-bold text-slate-900">6</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Başarılı</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Thermometer className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Sensör / Kamera</p>
                    <p className="text-3xl font-bold text-slate-900">18</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Aktif</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Saatlik Alarm Dağılımı</h3>
                <p className="text-sm text-slate-500 mb-2">Kamera ve sensör tetiklemeleri</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={hourlyAlarms}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="alarm" fill="#ef4444" name="Alarm" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center">
                <img
                  src={images.fire.depot}
                  alt="Yangın izleme bölgesi"
                  className="w-full h-48 object-cover rounded-xl border border-slate-200"
                />
                <p className="text-sm text-slate-500 mt-3">Örnek izleme bölgesi — Depo / üretim alanı</p>
              </div>
            </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Yangın Alarm Kayıtları (Kamera Görüntüsü)</h3>
              <p className="text-sm text-slate-500 mb-4">Hangi kamera, saat ve olay anı görüntüsü.</p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Kamera</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Bölge</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Saat</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Tür</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Olay Anı Görüntüsü</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alarmRecords.map((r, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-blue-600" />
                            <span className="font-mono text-sm font-medium text-slate-900">{r.cameraId}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-900">{r.region}</td>
                        <td className="py-4 px-4 text-slate-600">{r.time}</td>
                        <td className="py-4 px-4">{r.type}</td>
                        <td className="py-4 px-4">
                          <img
                            src={r.thumb}
                            alt={`Olay anı ${r.region}`}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-slate-200"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {r.status}
                          </span>
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
