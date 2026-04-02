import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Users, UserPlus, Search, Shield, User, X, Trash2 } from 'lucide-react';
import { getToken, createUser as apiCreateUser, listUsers, deleteUser as apiDeleteUser, type UserRow } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type DisplayUser = { id: string; name: string; email: string; role: string; status: string };

function mapUserRowToDisplay(row: UserRow): DisplayUser {
  return {
    id: row.id,
    name: row.username,
    email: `${row.username}@sistem`,
    role: row.role === 'admin' ? 'Yönetici' : 'Kullanıcı',
    status: 'Aktif',
  };
}

const FALLBACK_USERS: DisplayUser[] = [
  { id: '1', name: 'Admin Kullanıcı', email: 'admin@orbitra.com', role: 'Yönetici', status: 'Aktif' },
  { id: '2', name: 'Ahmet Yılmaz', email: 'ahmet@orbitra.com', role: 'Müdür', status: 'Aktif' },
  { id: '3', name: 'Ayşe Demir', email: 'ayse@orbitra.com', role: 'Operatör', status: 'Aktif' },
  { id: '4', name: 'Mehmet Kaya', email: 'mehmet@orbitra.com', role: 'Operatör', status: 'Pasif' },
];

export default function UserManagementPage() {
  const { effectiveUser } = useAuth();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<DisplayUser[]>(FALLBACK_USERS);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<DisplayUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token) {
      listUsers(token)
        .then((rows) => setUsers(rows.map(mapUserRowToDisplay)))
        .catch(() => {});
    }
  }, []);

  const handleOpenNewUser = () => {
    setNewUsername('');
    setNewPassword('');
    setNewRole('user');
    setSubmitError('');
    setShowNewModal(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    const username = newUsername.trim();
    if (!username) {
      setSubmitError('Kullanıcı adı girin.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setSubmitError('Şifre en az 4 karakter olmalıdır.');
      return;
    }
    const token = getToken();
    if (!token) {
      setSubmitError('Oturum açılmamış. Lütfen tekrar giriş yapın.');
      return;
    }
    setSubmitting(true);
    try {
      const row = await apiCreateUser(token, username, newPassword, newRole);
      setUsers((prev) => [mapUserRowToDisplay(row), ...prev]);
      setShowNewModal(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Kullanıcı oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const isCurrentUser = (u: DisplayUser) =>
    !!effectiveUser && u.name === effectiveUser.username;

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    const token = getToken();
    if (!token) {
      setDeleteError('Oturum açılmamış.');
      return;
    }
    if (isCurrentUser(userToDelete)) {
      setDeleteError('Kendi hesabınızı silemezsiniz.');
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      await apiDeleteUser(token, userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Kullanıcı silinemedi.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-full min-w-0">
        <Header />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Kullanıcı Yönetimi</h1>
              <p className="text-slate-600">Sistem kullanıcılarını yönetin</p>
            </div>
            <button
              type="button"
              onClick={handleOpenNewUser}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Yeni Kullanıcı
            </button>
          </div>

          <AnimatePresence>
            {showNewModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
                onClick={() => !submitting && setShowNewModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Yeni Kullanıcı</h2>
                    <button
                      type="button"
                      onClick={() => !submitting && setShowNewModal(false)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                      aria-label="Kapat"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Kullanıcı adı</label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="kullanici_adi"
                        autoFocus
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="admin">Yönetici</option>
                      </select>
                    </div>
                    {submitError && (
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{submitError}</p>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => !submitting && setShowNewModal(false)}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                        disabled={submitting}
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
                      >
                        {submitting ? 'Kaydediliyor...' : 'Oluştur'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {userToDelete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
                onClick={() => !deleting && setUserToDelete(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Kullanıcıyı Sil</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    <strong>{userToDelete.name}</strong> kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                  </p>
                  {deleteError && (
                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">{deleteError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setUserToDelete(null); setDeleteError(''); }}
                      disabled={deleting}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteUser}
                      disabled={deleting || isCurrentUser(userToDelete)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting ? 'Siliniyor...' : 'Sil'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">Kullanıcı Listesi</h3>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Kullanıcı</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">E-posta</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Rol</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Durum</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                              <User className="w-4 h-4 text-slate-600" />
                            </div>
                            <span className="font-medium text-slate-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            <Shield className="w-3.5 h-3.5" />
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            disabled={isCurrentUser(user)}
                            title={isCurrentUser(user) ? 'Kendi hesabınızı silemezsiniz' : 'Kullanıcıyı sil'}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
