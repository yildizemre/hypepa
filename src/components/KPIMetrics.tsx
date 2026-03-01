import { motion } from 'framer-motion';
import { Shield, Package, TrendingUp, AlertTriangle, Camera, Layers, Zap } from 'lucide-react';
import { useState } from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  trend: string;
  onClick: () => void;
}

function MetricCard({ title, value, unit, icon: Icon, color, bgColor, trend, onClick }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 cursor-pointer group hover:shadow-lg transition-shadow min-w-0"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend ? (
          <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        ) : null}
      </div>

      <div>
        <p className="text-slate-500 text-sm mb-1">{title}</p>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-slate-900">{value}</span>
          <span className="text-slate-500 text-sm">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface KPIMetricsProps {
  onMetricClick: (metric: string) => void;
}

/** Bayi / müşteri sunumu: dikkat çekici KPI'lar, birçok modülden veri hissi */
export default function KPIMetrics({ onMetricClick }: KPIMetricsProps) {
  const [metrics] = useState({
    hse: 98,
    alerts: 2,
    products: 12450,
    cameras: 24,
    modules: 28,
    todayDetections: 412,
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
      <MetricCard
        title="İSG Uyumu"
        value={metrics.hse}
        unit="%"
        icon={Shield}
        color="text-green-600"
        bgColor="bg-green-50"
        trend="+2,4%"
        onClick={() => onMetricClick('İSG Uyumu')}
      />
      <MetricCard
        title="Aktif Uyarılar"
        value={metrics.alerts}
        unit="adet"
        icon={AlertTriangle}
        color="text-amber-600"
        bgColor="bg-amber-50"
        trend="−5"
        onClick={() => onMetricClick('Aktif Uyarılar')}
      />
      <MetricCard
        title="Bugün Sayılan Ürün"
        value={metrics.products}
        unit="adet"
        icon={Package}
        color="text-violet-600"
        bgColor="bg-violet-50"
        trend="+18%"
        onClick={() => onMetricClick('Ürün Sayısı')}
      />
      <MetricCard
        title="Aktif Kamera"
        value={metrics.cameras}
        unit="adet"
        icon={Camera}
        color="text-blue-600"
        bgColor="bg-blue-50"
        trend="7/7"
        onClick={() => onMetricClick('Kamera')}
      />
      <MetricCard
        title="Aktif Modül"
        value={metrics.modules}
        unit="adet"
        icon={Layers}
        color="text-indigo-600"
        bgColor="bg-indigo-50"
        trend="Tamamı"
        onClick={() => onMetricClick('Modül')}
      />
      <MetricCard
        title="Bugün Tespit"
        value={metrics.todayDetections}
        unit="adet"
        icon={Zap}
        color="text-emerald-600"
        bgColor="bg-emerald-50"
        trend="+24%"
        onClick={() => onMetricClick('Tespit')}
      />
    </div>
  );
}
