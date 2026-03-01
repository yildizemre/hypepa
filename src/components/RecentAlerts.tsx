import { motion } from 'framer-motion';
import { Camera, HardHat } from 'lucide-react';

const alerts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop',
    cameraId: 'EL1 CAM1',
    detected: 'Gözlük tespiti',
    time: 'Çar, 12/3/2025, 11:51',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=250&fit=crop',
    cameraId: 'IHG',
    detected: 'Makine-personel kısıtlı alan',
    time: 'Cum, 7/3/2025, 09:40',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=250&fit=crop',
    cameraId: 'CC2 Tünel',
    detected: 'Düşme / hareket',
    time: 'Pzt, 10/3/2025, 14:22',
  },
];

export default function RecentAlerts() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white border border-slate-200 rounded-xl p-5 h-fit"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Son uyarılar</h3>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Tümünü gör
        </a>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
          >
            <div className="relative h-24 bg-slate-100">
              <img
                src={alert.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/70 text-white text-xs font-medium">
                <Camera className="w-3 h-3" />
                {alert.cameraId}
              </span>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-900 line-clamp-1 flex items-center gap-1">
                <HardHat className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                {alert.detected}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
