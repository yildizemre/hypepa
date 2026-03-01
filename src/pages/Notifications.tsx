import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Activity, FileText, Image, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useNavigation } from '../contexts/NavigationContext';

interface AIAlert {
  id: string;
  timestamp: string;
  camera: string;
  type: 'safety' | 'productivity' | 'quality';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  imageUrl: string;
  confidence: number;
  status: 'new' | 'reviewed' | 'resolved';
}

const mockAIAlerts: AIAlert[] = [
  {
    id: '1',
    timestamp: '2024-02-27 14:32:15',
    camera: 'Kamera 3 - Üretim Hattı A',
    type: 'safety',
    severity: 'critical',
    title: 'Baret Kullanımı Tespit Edilemedi',
    description: 'Üretim hattında 2 çalışan baret olmadan çalışıyor. İSG kurallarına aykırılık tespit edildi.',
    imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
    confidence: 94.5,
    status: 'new'
  },
  {
    id: '2',
    timestamp: '2024-02-27 14:28:42',
    camera: 'Kamera 7 - Depo',
    type: 'productivity',
    severity: 'warning',
    title: 'Uzun Süreli Hareketsizlik',
    description: 'Depo bölgesinde son 15 dakikadır herhangi bir aktivite tespit edilmedi.',
    imageUrl: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
    confidence: 87.2,
    status: 'new'
  },
  {
    id: '3',
    timestamp: '2024-02-27 14:15:33',
    camera: 'Kamera 2 - Montaj',
    type: 'quality',
    severity: 'info',
    title: 'Kalite Kontrol Uyarısı',
    description: 'Montaj hattında hatalı parça yerleşimi tespit edildi.',
    imageUrl: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=800',
    confidence: 91.8,
    status: 'reviewed'
  },
  {
    id: '4',
    timestamp: '2024-02-27 13:45:12',
    camera: 'Kamera 5 - Giriş',
    type: 'safety',
    severity: 'critical',
    title: 'Yetkisiz Giriş Denemesi',
    description: 'Tanınmayan personel kısıtlı alana girmeye çalıştı.',
    imageUrl: 'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=800',
    confidence: 96.3,
    status: 'resolved'
  }
];

export default function Notifications() {
  const { notificationSubPage, setNotificationSubPage } = useNavigation();
  const [selectedAlert, setSelectedAlert] = useState<AIAlert | null>(null);

  const subMenuItems = [
    { id: 'ai-alerts' as const, label: 'AI Bildirimler', icon: Activity },
    { id: 'system' as const, label: 'Sistem', icon: Bell },
    { id: 'reports' as const, label: 'Raporlar', icon: FileText },
  ];

  const getSeverityColor = (severity: AIAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type: AIAlert['type']) => {
    switch (type) {
      case 'safety': return AlertTriangle;
      case 'productivity': return Activity;
      case 'quality': return CheckCircle;
    }
  };

  const getStatusBadge = (status: AIAlert['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Yeni</span>;
      case 'reviewed':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">İncelendi</span>;
      case 'resolved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Çözüldü</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bildirimler</h1>
            <p className="text-slate-600">AI destekli görüntü işleme bildirimleri ve sistem uyarıları</p>
          </div>

          <div className="flex gap-2 mb-6">
            {subMenuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setNotificationSubPage(item.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  notificationSubPage === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {notificationSubPage === 'ai-alerts' && (
              <motion.div
                key="ai-alerts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {mockAIAlerts.map((alert, index) => {
                  const TypeIcon = getTypeIcon(alert.type);
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedAlert(alert)}
                      className={`bg-white rounded-xl p-6 border-l-4 cursor-pointer hover:shadow-lg transition-all ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-48 h-32 rounded-lg overflow-hidden relative group">
                            <img
                              src={alert.imageUrl}
                              alt={alert.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <TypeIcon className="w-6 h-6" />
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
                                <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                  <Clock className="w-4 h-4" />
                                  {alert.timestamp} · {alert.camera}
                                </p>
                              </div>
                            </div>
                            {getStatusBadge(alert.status)}
                          </div>

                          <p className="text-slate-700 mb-4">{alert.description}</p>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200 rounded-full h-2 w-32">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${alert.confidence}%` }}
                                />
                              </div>
                              <span className="text-slate-600 font-medium">{alert.confidence}% güven</span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                              <Image className="w-4 h-4" />
                              Detaylı İncele
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {notificationSubPage === 'system' && (
              <motion.div
                key="system"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-8 text-center"
              >
                <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Sistem Bildirimleri</h3>
                <p className="text-slate-600">Henüz sistem bildirimi bulunmuyor</p>
              </motion.div>
            )}

            {notificationSubPage === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-8 text-center"
              >
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Raporlar</h3>
                <p className="text-slate-600">Yakında eklenecek</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {selectedAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedAlert(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedAlert.title}</h2>
                  <p className="text-slate-600">{selectedAlert.camera} · {selectedAlert.timestamp}</p>
                </div>
                {getStatusBadge(selectedAlert.status)}
              </div>

              <img
                src={selectedAlert.imageUrl}
                alt={selectedAlert.title}
                className="w-full rounded-lg mb-6"
              />

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Açıklama</h3>
                  <p className="text-slate-700">{selectedAlert.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Güven Oranı</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedAlert.confidence}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Kategori</p>
                    <p className="text-2xl font-bold text-slate-900 capitalize">{selectedAlert.type}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    İşlemi Onayla
                  </button>
                  <button className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                    Yanlış Alarm
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
