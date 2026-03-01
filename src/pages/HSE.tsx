import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NotificationPanel from '../components/NotificationPanel';
import AlertFilterBar from '../components/AlertFilterBar';
import { HardHat, AlertTriangle, CheckCircle, XCircle, Camera, Inbox, X, MapPin, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { images } from '../config/images';

const defaultComplianceData: { item: string; compliance: number; violations: number }[] = [
  { item: 'Baret', compliance: 89, violations: 18 },
  { item: 'Yelek', compliance: 82, violations: 31 },
  { item: 'Eldiven', compliance: 71, violations: 52 },
  { item: 'Gözlük', compliance: 78, violations: 41 },
  { item: 'Ayakkabı', compliance: 93, violations: 12 },
];

type ViolationRecord = {
  cameraId: string;
  time: string;
  className: string;
  photo: string;
  status: string;
  location?: string;
  note?: string;
};

const violationRecords: ViolationRecord[] = [
  { cameraId: 'CAM-003', time: '15:23:45', className: 'Baret Eksik', photo: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop', status: 'Aktif', location: 'Montaj Hattı A', note: 'Çalışan baret takmadan alana giriş yaptı.' },
  { cameraId: 'CAM-007', time: '14:55:12', className: 'Yelek Eksik', photo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop', status: 'Aktif', location: 'Depo Bölgesi', note: 'Yansıtıcı yelek tespit edilmedi.' },
  { cameraId: 'CAM-003', time: '14:12:33', className: 'Eldiven Eksik', photo: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop', status: 'Çözüldü', location: 'Montaj Hattı A', note: 'İhlal giderildi, eldiven takıldı.' },
  { cameraId: 'CAM-011', time: '13:48:21', className: 'Gözlük Eksik', photo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop', status: 'Aktif', location: 'Üretim Alanı', note: 'Koruyucu gözlük kullanılmıyor.' },
  { cameraId: 'CAM-003', time: '13:15:09', className: 'Baret Eksik', photo: 'https://images.unsplash.com/photo-1576086213369-97a30623b9c4?w=200&h=200&fit=crop', status: 'Çözüldü', location: 'Montaj Hattı A', note: 'Uyarı sonrası baret takıldı.' },
  { cameraId: 'CAM-015', time: '12:45:56', className: 'Ayakkabı Eksik', photo: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop', status: 'Aktif', location: 'Kalite Kontrol', note: 'İş güvenliği ayakkabısı tespit edilmedi.' },
  { cameraId: 'CAM-007', time: '11:30:44', className: 'Yelek Eksik', photo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop', status: 'Çözüldü', location: 'Depo Bölgesi', note: 'Yelek giyildi, kayıt kapatıldı.' },
  { cameraId: 'CAM-011', time: '10:20:18', className: 'Eldiven Eksik', photo: 'https://images.unsplash.com/photo-1576086213369-97a30623b9c4?w=200&h=200&fit=crop', status: 'Aktif', location: 'Üretim Alanı', note: 'Eldiven uyarısı - beklemede.' },
  { cameraId: 'CAM-003', time: '09:55:27', className: 'Baret Eksik', photo: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop', status: 'Çözüldü', location: 'Montaj Hattı A', note: 'Düzeltme yapıldı.' },
  { cameraId: 'CAM-007', time: '09:12:05', className: 'Gözlük Eksik', photo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop', status: 'Aktif', location: 'Depo Bölgesi', note: 'Gözlük takılması bekleniyor.' },
];

/** Gelen veriye göre gösterilir. API'den veri gelince setComplianceData ile güncellenebilir. */
export default function HSE() {
  const [complianceData, setComplianceData] = useState(defaultComplianceData);
  const [detailViolation, setDetailViolation] = useState<ViolationRecord | null>(null);

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col lg:flex-row w-full">
      <AnimatePresence>
        {detailViolation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailViolation(null)}
              className="fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900">İhlal Detayı</h3>
                <button
                  onClick={() => setDetailViolation(null)}
                  className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <img
                    src={detailViolation.photo}
                    alt={detailViolation.className}
                    className="w-32 h-32 rounded-xl object-cover border-2 border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-mono text-sm font-medium text-slate-900">{detailViolation.cameraId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{detailViolation.time}</span>
                    </div>
                    {detailViolation.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{detailViolation.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-900">{detailViolation.className}</span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      detailViolation.status === 'Aktif' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {detailViolation.status}
                    </span>
                  </div>
                </div>
                {detailViolation.note && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-1">Açıklama</p>
                    <p className="text-sm text-slate-700">{detailViolation.note}</p>
                  </div>
                )}
                <div className="pt-4 flex justify-end gap-2">
                  {detailViolation.status === 'Aktif' && (
                    <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                      Çözüldü İşaretle
                    </button>
                  )}
                  <button
                    onClick={() => setDetailViolation(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <div className="mb-8 flex flex-wrap gap-6 items-start">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">İSG - Sağlık ve Güvenlik</h1>
              <p className="text-slate-600">
                Görüntü işleme ile baret, yelek, eldiven vb. KKD kontrolü. Hangi kamera, olay anı görüntüsü ve analizler aşağıda.
              </p>
            </div>
            <img
              src={images.safety.helmet}
              alt="İSG izleme"
              className="w-48 h-32 object-cover rounded-xl border border-slate-200 flex-shrink-0"
            />
          </div>

          <AlertFilterBar />
          <div className="mb-8">
            <NotificationPanel defaultFilter="isg-only" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <HardHat className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Toplam İSG Uyarısı</p>
                  <p className="text-3xl font-bold text-slate-900">47</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Son 24 saat</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Aktif İSG Uyarıları</p>
                  <p className="text-3xl font-bold text-slate-900">6</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Şu anda</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Çözülen İSG Uyarıları</p>
                  <p className="text-3xl font-bold text-slate-900">41</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Başarılı</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">İSG Ekipman Uyum Oranları</h3>
                    {complianceData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={complianceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="item" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="compliance" fill="#22c55e" name="Uyum (%)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[350px] flex flex-col items-center justify-center text-slate-400">
                        <Inbox className="w-12 h-12 mb-3" />
                        <p className="text-sm">Veri gelince burada gösterilecek</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">İhlal Dağılımı</h3>
                    {complianceData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={complianceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="item" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="violations" fill="#ef4444" name="İhlal Sayısı" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[350px] flex flex-col items-center justify-center text-slate-400">
                        <Inbox className="w-12 h-12 mb-3" />
                        <p className="text-sm">Veri gelince burada gösterilecek</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">İhlal Kayıtları</h3>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full min-w-[520px]">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Kamera ID</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Saat</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Sınıf</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Olay Anı Görüntüsü</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Durum</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {violationRecords.map((violation, index) => (
                          <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Camera className="w-4 h-4 text-blue-600" />
                                <span className="font-mono text-sm font-medium text-slate-900">{violation.cameraId}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-mono text-sm text-slate-600">{violation.time}</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-slate-900">{violation.className}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <img
                                src={violation.photo}
                                alt={`Olay anı - ${violation.className}`}
                                title="Olay anı görüntüsü"
                                className="w-20 h-20 rounded-lg object-cover border-2 border-slate-200 hover:border-blue-400 transition-colors cursor-pointer"
                                onClick={() => setDetailViolation(violation)}
                              />
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                violation.status === 'Aktif' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {violation.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => setDetailViolation(violation)}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                              >
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
