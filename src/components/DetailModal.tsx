import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: string;
}

export default function DetailModal({ isOpen, onClose, metric }: DetailModalProps) {
  const generateData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      value: 70 + Math.random() * 25,
      target: 85,
    }));
  };

  const data = generateData();
  const currentValue = data[data.length - 1].value;
  const previousValue = data[data.length - 2].value;
  const trend = currentValue > previousValue;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 max-w-4xl w-full relative shadow-xl my-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {metric}
              </h2>
              <p className="text-slate-500">Detaylı performans analizi</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Güncel Değer</div>
                <div className="text-3xl font-bold text-slate-900">{currentValue.toFixed(1)}%</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Hedef</div>
                <div className="text-3xl font-bold text-blue-600">85.0%</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Trend</div>
                <div className={`flex items-center space-x-2 ${trend ? 'text-green-600' : 'text-red-600'}`}>
                  {trend ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <TrendingDown className="w-6 h-6" />
                  )}
                  <span className="text-2xl font-bold">
                    {Math.abs(currentValue - previousValue).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">30 Günlük Performans</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    label={{ value: 'Gün', position: 'insideBottom', offset: -5, fill: '#64748b' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    label={{ value: 'Verimlilik (%)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#475569' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="text-sm text-green-600 mb-2">En Yüksek Performans</div>
                <div className="text-2xl font-bold text-green-700">
                  {Math.max(...data.map((d) => d.value)).toFixed(1)}%
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Gün {data.findIndex((d) => d.value === Math.max(...data.map((d) => d.value))) + 1}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-sm text-blue-600 mb-2">Ortalama</div>
                <div className="text-2xl font-bold text-blue-700">
                  {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}%
                </div>
                <div className="text-xs text-blue-600 mt-1">Son 30 gün</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
