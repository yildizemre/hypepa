import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NotificationPanel from '../components/NotificationPanel';
import AlertFilterBar from '../components/AlertFilterBar';
import { images } from '../config/images';
import { Package, Layers, TrendingUp, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/** Konveyör bandı / sayım hattı */
const conveyorLines = [
  { id: 'BANT-01', name: 'Konveyör Hat A - Paketleme', cameraId: 'CAM-001', location: 'Paketleme', count: 1892, accuracy: 98.2, status: 'active' as const },
  { id: 'BANT-02', name: 'Konveyör Hat B - Üretim', cameraId: 'CAM-004', location: 'Üretim', count: 3106, accuracy: 99.4, status: 'active' as const },
  { id: 'BANT-03', name: 'Konveyör Hat C - Kalite', cameraId: 'CAM-002', location: 'Kalite Kontrol', count: 756, accuracy: 96.8, status: 'active' as const },
  { id: 'BANT-04', name: 'Konveyör Hat D - Depo', cameraId: 'CAM-007', location: 'Depo Girişi', count: 1123, accuracy: 97.5, status: 'active' as const },
  { id: 'BANT-05', name: 'Konveyör Hat E - Çıkış', cameraId: 'CAM-011', location: 'Sevkiyat', count: 0, accuracy: 0, status: 'error' as const },
];

/** Saatlik konveyör sayım trendi (banddan geçen ürün) */
const hourlyConveyorData = [
  { hour: '08:00', urun: 428 },
  { hour: '09:00', urun: 612 },
  { hour: '10:00', urun: 734 },
  { hour: '11:00', urun: 681 },
  { hour: '12:00', urun: 312 },
  { hour: '13:00', urun: 558 },
  { hour: '14:00', urun: 702 },
  { hour: '15:00', urun: 819 },
  { hour: '16:00', urun: 645 },
  { hour: '17:00', urun: 421 },
];

/** Hat bazlı sayım (grafik) */
const lineCountData = conveyorLines.map((l) => ({ name: l.id.replace('BANT-', 'Hat '), sayim: l.count, dogruluk: l.accuracy }));

export default function ProductCounting() {
  const totalCount = conveyorLines.reduce((sum, l) => sum + l.count, 0);
  const activeLines = conveyorLines.filter((l) => l.status === 'active').length;
  const avgAccuracy =
    activeLines > 0
      ? (conveyorLines.filter((l) => l.status === 'active').reduce((s, l) => s + l.accuracy, 0) / activeLines).toFixed(1)
      : '0';

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col lg:flex-row w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-full min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <div className="mb-8 flex flex-wrap gap-6 items-start">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Ürün Sayımı</h1>
              <p className="text-slate-600">
                Görüntü işleme ile konveyör bandından geçen ürünleri kamera ile algılayıp sayıyoruz. Hangi kamera, hangi bant ve sayım grafikleri aşağıda.
              </p>
            </div>
            <img
              src={images.conveyor.belt}
              alt="Konveyör sayım"
              className="w-48 h-32 object-cover rounded-xl border border-slate-200 flex-shrink-0"
            />
          </div>

          <AlertFilterBar />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border border-slate-200"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Toplam Sayılan Ürün</p>
                  <p className="text-3xl font-bold text-slate-900">{totalCount.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Bugün (tüm bantlar)</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 border border-slate-200"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <Layers className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Aktif Konveyör Bantı</p>
                  <p className="text-3xl font-bold text-slate-900">{activeLines}/{conveyorLines.length}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Sayım yapılan hat</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-slate-200"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-violet-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Ortalama Doğruluk</p>
                  <p className="text-3xl font-bold text-slate-900">{avgAccuracy}%</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Algılama doğruluğu</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Saatlik Konveyör Sayım Trendi</h3>
              <p className="text-sm text-slate-500 mb-2">Banddan geçen ürün (saatlik)</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={hourlyConveyorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="urun" stroke="#3b82f6" strokeWidth={2} name="Ürün (adet)" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Hat Bazlı Sayım ve Doğruluk</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={lineCountData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis yAxisId="left" stroke="#64748b" />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sayim" fill="#3b82f6" name="Sayım (adet)" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="right" dataKey="dogruluk" fill="#8b5cf6" name="Doğruluk (%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 border border-slate-200 mb-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Konveyör Bantları ve Sayım</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Durum</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Bant ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Görüntü</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Bant / Hat</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Kamera</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Konum</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Bugünkü Sayım</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Doğruluk</th>
                  </tr>
                </thead>
                <tbody>
                  {conveyorLines.map((line, index) => (
                    <motion.tr
                      key={line.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-4">
                        {line.status === 'active' && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                        {line.status === 'error' && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono text-sm font-medium text-slate-900">{line.id}</td>
                      <td className="py-4 px-4">
                        <img src={images.conveyor.belt} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900">{line.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-sm text-slate-600">{line.cameraId}</td>
                      <td className="py-4 px-4 text-slate-600">{line.location}</td>
                      <td className="py-4 px-4">
                        <span className="text-lg font-bold text-slate-900">{line.count.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        {line.status === 'active' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  line.accuracy >= 98 ? 'bg-green-500' : line.accuracy >= 95 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${line.accuracy}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{line.accuracy}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <NotificationPanel defaultFilter="urun-sayimi-only" />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
