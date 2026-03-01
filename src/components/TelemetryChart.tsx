import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

interface DataPoint {
  time: string;
  isg: number;
  urun: number;
}

export default function TelemetryChart() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const initialData: DataPoint[] = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      initialData.push({
        time: `${String(time.getHours()).padStart(2, '0')}:00`,
        isg: 90 + Math.random() * 10,
        urun: 80 + Math.floor(Math.random() * 200),
      });
    }
    setData(initialData);

    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
          isg: 90 + Math.random() * 10,
          urun: 80 + Math.floor(Math.random() * 200),
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-lg p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Günlük Trend</h3>
          <p className="text-xs sm:text-sm text-slate-500">Kamera görüntülerinden İSG uyumu ve ürün sayımı (son 24 saat)</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-xs text-slate-600">İSG (%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-violet-500 rounded-full" />
            <span className="text-xs text-slate-600">Ürün sayımı</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIsg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorUrun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="time"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#475569' }}
          />
          <Area
            type="monotone"
            dataKey="isg"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#colorIsg)"
            animationDuration={1000}
            name="İSG %"
          />
          <Area
            type="monotone"
            dataKey="urun"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#colorUrun)"
            animationDuration={1000}
            name="Ürün"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
