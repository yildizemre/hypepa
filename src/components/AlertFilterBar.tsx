import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

const sections = ['Tüm bölümler', 'Montaj', 'Üretim', 'Depo', 'Paketleme', 'Kalite'];
const cameras = ['Tüm kameralar', 'CAM-001', 'CAM-002', 'CAM-003', 'CAM-007', 'CAM-011'];
const types = ['Tüm türler', 'Yangın', 'İSG', 'Ürün Sayımı', 'Düşme', 'KKD', 'Sıcaklık'];
const severities = ['Tüm önemler', 'Kritik', 'Uyarı', 'Bilgi'];
const ranges = ['Günlük', 'Haftalık', 'Aylık'];

export default function AlertFilterBar() {
  const [section, setSection] = useState(sections[0]);
  const [camera, setCamera] = useState(cameras[0]);
  const [type, setType] = useState(types[0]);
  const [severity, setSeverity] = useState(severities[0]);
  const [range, setRange] = useState(ranges[1]);
  const [dateLabel, setDateLabel] = useState('10 Mart 2025 - 16 Mart 2025');

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white border border-slate-200 rounded-xl">
      <select
        value={section}
        onChange={(e) => setSection(e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      >
        {sections.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        value={camera}
        onChange={(e) => setCamera(e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      >
        {cameras.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      >
        {types.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      >
        {severities.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        value={range}
        onChange={(e) => setRange(e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      >
        {ranges.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">
        <Calendar className="w-4 h-4 text-slate-500" />
        <span>{dateLabel}</span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  );
}
