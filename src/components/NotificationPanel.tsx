import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, Package, AlertTriangle, Thermometer, HardHat, Camera, X } from 'lucide-react';

export type NotificationCategory = 'yangin' | 'isg' | 'urun-sayimi' | 'dusme' | 'sicaklik' | 'ppe' | 'guvenlik' | 'alan-ihlali';

export interface NotificationItem {
  id: string;
  image: string;
  category: NotificationCategory;
  title: string;
  description: string;
  time: string;
  dateTime: string;
  cameraId: string;
  severity: 'kritik' | 'uyari' | 'bilgi';
  location?: string;
  alertCount?: number;
}

const categoryLabels: Record<NotificationCategory, string> = {
  yangin: 'Yangın',
  isg: 'İSG',
  'urun-sayimi': 'Ürün Sayımı',
  dusme: 'Düşme',
  sicaklik: 'Sıcaklık',
  ppe: 'KKD Uyumu',
  guvenlik: 'Güvenlik',
  'alan-ihlali': 'Alan İhlali',
};

const categoryColors: Record<NotificationCategory, string> = {
  yangin: 'bg-red-100 text-red-700 border-red-200',
  isg: 'bg-amber-100 text-amber-700 border-amber-200',
  'urun-sayimi': 'bg-blue-100 text-blue-700 border-blue-200',
  dusme: 'bg-orange-100 text-orange-700 border-orange-200',
  sicaklik: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ppe: 'bg-violet-100 text-violet-700 border-violet-200',
  guvenlik: 'bg-slate-100 text-slate-700 border-slate-200',
  'alan-ihlali': 'bg-red-100 text-red-700 border-red-200',
};

const categoryIcons: Record<NotificationCategory, React.ComponentType<{ className?: string }>> = {
  yangin: Flame,
  isg: Shield,
  'urun-sayimi': Package,
  dusme: AlertTriangle,
  sicaklik: Thermometer,
  ppe: HardHat,
  guvenlik: Camera,
  'alan-ihlali': Shield,
};

const severityStyles = {
  kritik: 'border-red-300 bg-red-50/50',
  uyari: 'border-amber-300 bg-amber-50/50',
  bilgi: 'border-slate-200 bg-white',
};

const cameras = ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-007', 'CAM-011', 'CAM-015', 'EL1-CAM1', 'CC2-Tünel'];

/** Modül / sayfa başına tam 2 bildirim; görseller public/ klasöründen */
const mockNotifications: Omit<NotificationItem, 'id' | 'time' | 'dateTime' | 'cameraId'>[] = [
  { image: '/yanginvegaz.jpg', category: 'yangin', title: 'Yangın Tespit Edildi', description: 'Depo A - Bölge 3. Duman sensörü tetiklendi.', severity: 'kritik', location: 'Depo A', alertCount: 2 },
  { image: '/yanginvegaz.jpg', category: 'yangin', title: 'Gaz Kaçağı Uyarısı', description: 'Üretim B - Metan sensörü eşik aşıldı.', severity: 'kritik', location: 'Üretim B', alertCount: 1 },
  { image: '/baretmaske.jpg', category: 'ppe', title: 'Baret Uyumsuzluğu', description: 'Montaj hattı - 1 personel baret takmıyor.', severity: 'uyari', location: 'Montaj', alertCount: 1 },
  { image: '/eldivenonluk.jpg', category: 'ppe', title: 'Eldiven Uyumu Doğrulandı', description: 'Tüm vardiya personeli KKD uyumlu.', severity: 'bilgi', location: 'Genel' },
  { image: '/yasaklialan.jpg', category: 'alan-ihlali', title: 'Girilmez Alana Giriş', description: 'Kamera görüntüsünde kısıtlı alana kişi girişi.', severity: 'kritik', location: 'Depo Girişi', alertCount: 2 },
  { image: '/yasaklialan.jpg', category: 'alan-ihlali', title: 'Yasaklı Bölge İhlali', description: 'Üretim hattı kısıtlı bölgesine yetkisiz giriş.', severity: 'kritik', location: 'Üretim Hat 2', alertCount: 1 },
  { image: '/isiharitasi.jpg', category: 'urun-sayimi', title: 'Ürün Sayımı Tamamlandı', description: 'Paketleme hattı - Son 1 saat: 2.841 adet.', severity: 'bilgi', location: 'Paketleme' },
  { image: '/isiharitasi.jpg', category: 'urun-sayimi', title: 'Konveyör Bandı Sayımı', description: 'Hat B - Banddan geçen ürün: 3.106 adet.', severity: 'bilgi', location: 'Konveyör Hat B' },
];

function formatTime(minutesAgo: number): string {
  if (minutesAgo < 60) return `${minutesAgo} dk önce`;
  const h = Math.floor(minutesAgo / 60);
  if (h < 24) return `${h} saat önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

function formatDateTime(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${day}.${month}.${year} ${h}:${m}:${s}`;
}

interface NotificationPanelProps {
  /** Sayfa bazlı sabit filtre (örn. İSG sayfasında sadece İSG, Yangın sayfasında sadece yangın) */
  defaultFilter?: NotificationCategory | 'isg-only' | 'yangin-only' | 'alan-ihlali-only' | 'urun-sayimi-only';
}

export default function NotificationPanel({ defaultFilter }: NotificationPanelProps = {}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<NotificationCategory | 'tumu'>(
    defaultFilter === 'isg-only' ? 'isg' : defaultFilter === 'yangin-only' ? 'yangin' : defaultFilter === 'alan-ihlali-only' ? 'alan-ihlali' : defaultFilter === 'urun-sayimi-only' ? 'urun-sayimi' : 'tumu'
  );

  const [selectedItem, setSelectedItem] = useState<NotificationItem | null>(null);

  useEffect(() => {
    const now = Date.now();
    const initial: NotificationItem[] = mockNotifications.map((n, i) => {
      const mins = i * 5 + 2;
      return {
        ...n,
        id: `n-${i}-${now}`,
        time: formatTime(mins),
        dateTime: formatDateTime(mins),
        cameraId: cameras[i % cameras.length],
      };
    });
    setNotifications(initial);
  }, []);

  const filtered =
    defaultFilter === 'isg-only'
      ? notifications.filter((n) => n.category === 'isg' || n.category === 'ppe')
      : defaultFilter === 'yangin-only'
        ? notifications.filter((n) => n.category === 'yangin')
        : defaultFilter === 'alan-ihlali-only'
          ? notifications.filter((n) => n.category === 'alan-ihlali')
          : defaultFilter === 'urun-sayimi-only'
            ? notifications.filter((n) => n.category === 'urun-sayimi')
            : filter === 'tumu'
              ? notifications
              : notifications.filter((n) => n.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Gerçek Zamanlı Bildirimler
          {defaultFilter === 'isg-only' && <span className="ml-2 text-sm font-normal text-amber-600">(sadece İSG)</span>}
          {defaultFilter === 'yangin-only' && <span className="ml-2 text-sm font-normal text-red-600">(sadece yangın)</span>}
          {defaultFilter === 'alan-ihlali-only' && <span className="ml-2 text-sm font-normal text-red-600">(girilmez alan ihlali - görüntülü)</span>}
          {defaultFilter === 'urun-sayimi-only' && <span className="ml-2 text-sm font-normal text-blue-600">(konveyör bandı sayımı)</span>}
        </h2>
        {!defaultFilter && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('tumu')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'tumu' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tümü
            </button>
            {(Object.keys(categoryLabels) as NotificationCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  filter === cat ? categoryColors[cat] + ' border-current' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden min-w-0">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">Görsel</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Kategori</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Başlık</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Açıklama / Konum</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">Kamera</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-36">Tarih</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-28">Önem</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">Uyarı</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-28">Zaman</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map((item, index) => {
                  const Icon = categoryIcons[item.category];
                  const severityClass = severityStyles[item.severity];
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => setSelectedItem(item)}
                      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer ${severityClass}`}
                    >
                      <td className="py-3 px-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={item.image}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const next = e.currentTarget.nextElementSibling as HTMLElement;
                              if (next) next.style.display = 'flex';
                            }}
                          />
                          <div className="hidden absolute inset-0 items-center justify-center bg-slate-200" style={{ display: 'none' }}>
                            <Icon className="w-6 h-6 text-slate-400" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${categoryColors[item.category]}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {categoryLabels[item.category]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-900">{item.title}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-slate-600 max-w-xs">{item.description}</p>
                        {item.location && (
                          <p className="text-xs text-slate-500 mt-0.5">Konum: {item.location}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-700 font-medium">
                          <Camera className="w-3.5 h-3.5 text-slate-400" />
                          {item.cameraId}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 tabular-nums">{item.dateTime}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium ${
                          item.severity === 'kritik' ? 'text-red-600' :
                          item.severity === 'uyari' ? 'text-amber-600' : 'text-slate-500'
                        }`}>
                          {item.severity === 'kritik' ? 'Kritik' : item.severity === 'uyari' ? 'Uyarı' : 'Bilgi'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {(item.alertCount != null && item.alertCount > 0) ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">
                            <AlertTriangle className="w-3 h-3" />
                            {item.alertCount}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">{item.time}</td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-12">Bu kategoride bildirim yok.</p>
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${categoryColors[selectedItem.category]}`}>
                    {categoryLabels[selectedItem.category]}
                  </span>
                  <span className="font-semibold text-slate-900">{selectedItem.title}</span>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    {selectedItem.cameraId}
                  </span>
                  <span className="text-sm text-slate-500 tabular-nums">{selectedItem.dateTime}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full max-h-[70vh] object-contain rounded-lg bg-slate-100"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.className = 'w-full max-h-[70vh] rounded-lg bg-slate-200 flex items-center justify-center text-slate-400';
                  }}
                />
                {selectedItem.description && (
                  <p className="mt-4 text-sm text-slate-600">{selectedItem.description}</p>
                )}
                {selectedItem.location && (
                  <p className="mt-1 text-xs text-slate-500">Konum: {selectedItem.location}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
