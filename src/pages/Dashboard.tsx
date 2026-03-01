import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import KPIMetrics from '../components/KPIMetrics';
import TelemetryChart from '../components/TelemetryChart';
import ActivityFeed from '../components/ActivityFeed';
import DetailModal from '../components/DetailModal';
import { images } from '../config/images';
import { Camera, MapPin, AlertTriangle, User, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const personelVerimlilikData = [
  { gun: 'Pzt', oran: 87 },
  { gun: 'Sal', oran: 92 },
  { gun: 'Çar', oran: 89 },
  { gun: 'Per', oran: 94 },
  { gun: 'Cum', oran: 91 },
  { gun: 'Cmt', oran: 78 },
];

const makineVerimlilikData = [
  { saat: '08', kullanim: 72 },
  { saat: '10', kullanim: 88 },
  { saat: '12', kullanim: 65 },
  { saat: '14', kullanim: 91 },
  { saat: '16', kullanim: 85 },
  { saat: '18', kullanim: 70 },
];

const cameraZones = [
  { id: 'CAM-001', zone: 'Montaj Hattı A', count: 6, thumb: images.safety.helmet },
  { id: 'CAM-002', zone: 'Depo Girişi', count: 4, thumb: images.dashboard.warehouse },
  { id: 'CAM-003', zone: 'Üretim', count: 7, thumb: images.dashboard.factory },
  { id: 'CAM-004', zone: 'Paketleme', count: 3, thumb: images.conveyor.belt },
];

/** Birçok modülden bildirim hissi: farklı modül türleri ve görseller */
const recentAlerts = [
  { id: 1, cameraId: 'CAM-003', time: '15:41', type: 'Baret Kontrolü', message: 'Baret eksik – Montaj A', thumb: images.safety.helmet, status: 'Aktif' },
  { id: 2, cameraId: 'CAM-007', time: '15:12', type: 'Yangın Tespiti', message: 'Duman sensörü tetiklendi', thumb: images.fire.smoke, status: 'Çözüldü' },
  { id: 3, cameraId: 'CAM-012', time: '14:38', type: 'Yasaklı Alan', message: 'Girilmez alana giriş', thumb: images.area.restricted, status: 'Çözüldü' },
  { id: 4, cameraId: 'CAM-001', time: '14:05', type: 'Ürün Sayımı', message: 'Bant A: 2.841 adet', thumb: images.conveyor.belt, status: 'Bilgi' },
  { id: 5, cameraId: 'CAM-009', time: '13:22', type: 'İSG Genel', message: 'Yelek eksik – Depo', thumb: images.safety.vest, status: 'Çözüldü' },
  { id: 6, cameraId: 'CAM-005', time: '12:58', type: 'Gaz Kaçağı', message: 'Metan eşik aşıldı', thumb: images.fire.depot, status: 'Bilgi' },
  { id: 7, cameraId: 'CAM-008', time: '12:15', type: 'Forklift Mesafe', message: 'İnsan–makine yakınlık uyarısı', thumb: images.vehicle.forklift, status: 'Çözüldü' },
  { id: 8, cameraId: 'CAM-011', time: '11:42', type: 'Düşme Tespiti', message: 'Hareket sensörü olayı', thumb: images.behavioral.slip, status: 'Çözüldü' },
  { id: 9, cameraId: 'CAM-002', time: '11:08', type: 'Kamera Lens', message: 'Lens kapatılması tespit edildi', thumb: images.camera.cctv, status: 'Bilgi' },
  { id: 10, cameraId: 'CAM-014', time: '10:35', type: 'Sahipsiz Cisim', message: 'Nesne tespiti – koridor', thumb: images.area.warehouse, status: 'Çözüldü' },
  { id: 11, cameraId: 'CAM-006', time: '10:12', type: 'Yaş / Cinsiyet', message: 'Perakende analiz güncellendi', thumb: images.retail.store, status: 'Bilgi' },
  { id: 12, cameraId: 'CAM-001', time: '09:55', type: 'Yüz Tanıma', message: 'Personel giriş kaydı', thumb: images.retail.crowd, status: 'Bilgi' },
];

/** Modül bazlı bildirim sayıları – ana sayfada “bir sürü modülden” hissi */
const moduleNotificationCounts = [
  { label: 'Yangın / Gaz', count: 3, color: 'bg-red-100 text-red-700' },
  { label: 'İSG / KKD', count: 8, color: 'bg-amber-100 text-amber-700' },
  { label: 'Yasaklı Alan', count: 4, color: 'bg-orange-100 text-orange-700' },
  { label: 'Ürün Sayımı', count: 12, color: 'bg-violet-100 text-violet-700' },
  { label: 'Forklift / Makine', count: 5, color: 'bg-blue-100 text-blue-700' },
  { label: 'Düşme / Davranış', count: 2, color: 'bg-slate-100 text-slate-700' },
  { label: 'Kamera Lens', count: 1, color: 'bg-sky-100 text-sky-700' },
  { label: 'Perakende / Yüz', count: 6, color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Sahipsiz Nesne', count: 2, color: 'bg-teal-100 text-teal-700' },
];

export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [verimlilikTab, setVerimlilikTab] = useState<'personel' | 'makine'>('personel');

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col lg:flex-row w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-full min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-4 sm:mb-6 lg:mb-8"
          >
            <img
              src={images.dashboard.hero}
              alt="Görüntü işleme ve kamera izleme"
              className="w-full h-32 sm:h-40 lg:h-44 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h1 className="text-xl sm:text-2xl font-bold mb-1">Hype Vision Kontrol Paneli</h1>
              <p className="text-slate-200 text-xs sm:text-sm">
                Kamera tabanlı görüntü işleme ile güvenlik, İSG ve üretim analizleri. Tüm bölgeler tek ekrandan izlenir.
              </p>
            </div>
          </motion.section>

          <motion.div
            data-tour="kpi-metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 sm:mb-6"
          >
            <KPIMetrics onMetricClick={setSelectedMetric} />
          </motion.div>

          <motion.section
            data-tour="module-summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4 sm:mb-6 lg:mb-8 min-w-0"
          >
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Modüllerden Bildirim Özeti</h2>
              <p className="text-sm text-slate-500 mb-4">
                Tüm modüllerden gelen son bildirim sayıları. Görüntü işleme ile tek panelden takip.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {moduleNotificationCounts.map((m, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${m.color}`}
                  >
                    {m.label}
                    <span className="font-bold">{m.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 min-w-0"
            >
              <TelemetryChart />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="min-w-0"
            >
              <ActivityFeed />
            </motion.div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4 sm:mb-6 lg:mb-8"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
              Verimlilik
            </h2>
            <div className="flex border-b border-slate-200 px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setVerimlilikTab('personel')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  verimlilikTab === 'personel'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Personel Verimliliği
              </button>
              <button
                type="button"
                onClick={() => setVerimlilikTab('makine')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  verimlilikTab === 'makine'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Makine Verimliliği
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {verimlilikTab === 'personel' && (
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100 min-w-0">
                    <User className="w-10 h-10 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500">Ortalama Personel Verimliliği</p>
                      <p className="text-2xl font-bold text-slate-900">%88,5</p>
                      <p className="text-xs text-slate-500">Son 7 gün</p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-[220px] min-w-0">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={personelVerimlilikData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="gun" stroke="#64748b" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="oran" fill="#3b82f6" name="Verimlilik (%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {verimlilikTab === 'makine' && (
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100 min-w-0">
                    <Cpu className="w-10 h-10 text-violet-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500">Ortalama Makine Kullanımı</p>
                      <p className="text-2xl font-bold text-slate-900">%78,5</p>
                      <p className="text-xs text-slate-500">Bugün</p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-[220px] min-w-0">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={makineVerimlilikData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="saat" stroke="#64748b" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="kullanim" fill="#8b5cf6" name="Kullanım (%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 min-w-0"
            >
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600 flex-shrink-0" />
                Kamera ve Bölge Özeti
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Görüntü işleme analizlerinin yapıldığı kameralar ve bölgeler.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {cameraZones.map((z) => (
                  <div
                    key={z.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={z.thumb}
                      alt={z.zone}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-medium text-slate-900">{z.id}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {z.zone}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{z.count} kamera</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 min-w-0"
            >
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                Son Uyarılar (Görüntü İşleme)
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Kamera görüntülerinden tespit edilen son olaylar.
              </p>
              <div className="space-y-3">
                {recentAlerts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={a.thumb}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-slate-500">{a.cameraId} · {a.time}</p>
                      <p className="text-sm font-medium text-slate-900">{a.message}</p>
                      <span className="text-xs text-slate-500">{a.type}</span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        a.status === 'Aktif' ? 'bg-amber-100 text-amber-700' : a.status === 'Çözüldü' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </main>
      </div>

      <DetailModal
        isOpen={selectedMetric !== null}
        onClose={() => setSelectedMetric(null)}
        metric={selectedMetric || ''}
      />
    </div>
  );
}
