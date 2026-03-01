import { motion } from 'framer-motion';
import { Flame, Shield, Package, AlertTriangle, HardHat, Cpu, TrendingUp } from 'lucide-react';

const categories = [
  { id: 'uretim', label: 'Üretim / Makine', count: 681, trend: 145, icon: Cpu },
  { id: 'urun', label: 'Ürün Sayımı', count: 90, trend: 190, icon: Package },
  { id: 'isg', label: 'İSG / KKD', count: 8, trend: 286, icon: HardHat },
  { id: 'personel', label: 'Personel', count: 1103, trend: 286, icon: Shield },
  { id: 'yangin', label: 'Yangın / Güvenlik', count: 10, trend: 100, icon: Flame },
];

export default function AlertOverview() {
  const totalAlerts = 1892;
  const highSeverity = 248;
  const totalTrend = 215;
  const highTrend = 265;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-6"
        >
          <p className="text-sm text-slate-600 mb-1">Toplam uyarı</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-orange-600">{totalAlerts.toLocaleString('tr-TR')}</span>
            <span className="text-sm font-semibold text-green-600">%{totalTrend} ↑ önceki aya göre</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-slate-200 rounded-xl p-6"
        >
          <p className="text-sm text-slate-600 mb-1">Yüksek önem (kritik)</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-red-600">{highSeverity}</span>
            <span className="text-sm font-semibold text-green-600">%{highTrend} ↑ önceki aya göre</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Uyarılar (kategori)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="flex flex-col items-center sm:items-start p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <cat.icon className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-xs font-medium text-slate-600 line-clamp-1">{cat.label}</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">{cat.count}</span>
              <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> %{cat.trend} ↑
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
