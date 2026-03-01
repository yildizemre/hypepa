import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { images } from '../config/images';

interface Activity {
  id: string;
  time: string;
  type: 'helmet' | 'unit' | 'alert' | 'safety' | 'yangin' | 'alan' | 'forklift' | 'dusme' | 'perakende' | 'kamera' | 'gaz';
  message: string;
  status: 'success' | 'warning' | 'info';
}

/** Birçok modülden gelen aktivite hissi */
const activityTemplates = [
  { type: 'helmet', message: 'Baret Kontrolü: Uyum doğrulandı', status: 'success' },
  { type: 'unit', message: 'Ürün Sayımı: Bant A 2.841 adet', status: 'info' },
  { type: 'alert', message: 'Yasaklı Alan: Girilmez bölge ihlali', status: 'warning' },
  { type: 'safety', message: 'İSG: KKD uyumu tamamlandı', status: 'success' },
  { type: 'yangin', message: 'Yangın Modülü: Duman tespiti çözüldü', status: 'success' },
  { type: 'alan', message: 'Alan İhlali: Kamera 12 olay kaydetti', status: 'warning' },
  { type: 'forklift', message: 'Forklift Mesafe: İnsan–makine uyarısı', status: 'warning' },
  { type: 'dusme', message: 'Düşme Tespiti: Hareket sensörü olayı', status: 'warning' },
  { type: 'perakende', message: 'Perakende: Yoğunluk analizi güncellendi', status: 'info' },
  { type: 'kamera', message: 'Kamera Lens: Kapatılma tespit edildi', status: 'info' },
  { type: 'gaz', message: 'Gaz Kaçağı: Metan sensörü normal', status: 'success' },
  { type: 'unit', message: 'Konveyör: Hat B sayım tamamlandı', status: 'success' },
];

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const initialActivities: Activity[] = [];
    const now = new Date();

    for (let i = 0; i < 8; i++) {
      const time = new Date(now.getTime() - i * 3 * 60 * 1000);
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
      initialActivities.push({
        id: `initial-${i}`,
        time: `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`,
        type: template.type as Activity['type'],
        message: template.message,
        status: template.status as Activity['status'],
      });
    }

    setActivities(initialActivities);

    const interval = setInterval(() => {
      const now = new Date();
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
      const newActivity: Activity = {
        id: `${Date.now()}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        type: template.type as Activity['type'],
        message: template.message,
        status: template.status as Activity['status'],
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const getThumb = (type: Activity['type']) => {
    switch (type) {
      case 'helmet':
      case 'safety':
        return images.safety.helmet;
      case 'unit':
        return images.conveyor.belt;
      case 'alert':
      case 'yangin':
      case 'gaz':
        return images.fire.smoke;
      case 'alan':
        return images.area.restricted;
      case 'forklift':
        return images.vehicle.forklift;
      case 'dusme':
        return images.behavioral.slip;
      case 'perakende':
        return images.retail.store;
      case 'kamera':
        return images.camera.cctv;
      default:
        return images.camera.cctv;
    }
  };

  const getColor = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-slate-200 rounded-lg p-6 h-full flex flex-col"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Modüllerden Canlı Akış</h3>

      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => {
            const colorClass = getColor(activity.status);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${colorClass} hover:scale-102 transition-transform cursor-pointer`}
              >
                <img
                  src={getThumb(activity.type)}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{activity.message}</div>
                  {activity.type === 'unit' && (
                    <div className="text-xs text-slate-500">#{1200 + Math.floor(Math.random() * 100)}</div>
                  )}
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
