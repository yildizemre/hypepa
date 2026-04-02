import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, BarChart3, Shield, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const features = [
  { icon: BarChart3, label: 'Analitik', desc: 'Performans ve trend raporları' },
  { icon: Shield, label: 'İSG', desc: 'Güvenlik ve uyum takibi' },
  { icon: Package, label: 'Sayım', desc: 'Ürün ve personel sayımı' },
];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Geçersiz giriş bilgileri');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol: gradient arka plan + modern özellik alanı */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-violet-800">
        {/* Arka plan efektleri */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="text-blue-200/90 text-sm font-medium tracking-widest uppercase">Yapay Zeka Analitik</span>
            <h1 className="text-4xl xl:text-5xl font-bold mt-2 mb-5 tracking-tight">Orbitra</h1>
            <div className="w-16 h-1 rounded-full bg-white/50" />
            <p className="text-blue-100/95 text-lg leading-relaxed max-w-md mt-6">
              Tesisinizi gerçek zamanlı izleyin, sayım ve İSG takibini tek ekrandan yönetin.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 mt-12">
            {features.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex flex-col items-start">
                  <div className="p-2.5 rounded-xl bg-white/20 group-hover:bg-white/25 transition-colors mb-3">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white text-sm">{item.label}</span>
                  <span className="text-blue-100/80 text-xs mt-1 leading-snug">{item.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ: giriş formu */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                <img
                  src="/orbisoft.webp"
                  alt="Orbitra"
                  className="h-16 w-auto object-contain"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-500 text-sm mt-1"
              >
                Yapay Zeka Analitik Platformu
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Kullanıcı adını girin"
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Şifrenizi girin"
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
