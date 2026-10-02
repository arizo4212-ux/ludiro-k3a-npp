import { useState } from 'react';
import { 
  Ship, 
  Database, 
  LogOut, 
  Sparkles, 
  RefreshCw,
  Radio,
  Wifi
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { checkAndSeedInitialData } from '../../firebase/seed';

interface NavbarProps {
  onRefreshData?: () => void;
  onlineCount?: number;
}

export function Navbar({ onRefreshData, onlineCount = 1 }: NavbarProps) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await checkAndSeedInitialData();
      if (res.seeded) {
        showToast(
          'success',
          'Data Terisi ke Cloud Firestore',
          `Berhasil memasukkan data awal armada (${res.counts.vessels} kapal, ${res.counts.voyages} pelayaran, ${res.counts.cargo} kargo, ${res.counts.crew} awak).`
        );
      } else {
        showToast(
          'info',
          'Database Sudah Lengkap',
          `Data kapal (${res.counts.vessels} unit) sudah online di Cloud Firestore.`
        );
      }
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      showToast('error', 'Gagal Sinkronisasi', err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white flex items-center justify-center shadow-xs">
            <Ship className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Nusantara <span className="text-cyan-600">MarineFlow</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE REALTIME
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Sistem Manajemen Pelayaran & Armada Maritim Nasional
            </p>
          </div>
        </div>

        {/* Center: Live Real-time Database Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold shadow-2xs">
          <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Cloud Firestore Real-Time</span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-500 font-mono">Live Sync</span>
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-3">
          {/* Seed / Reload Data Button */}
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            title="Muat data maritim awal ke Firestore"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Menyinkronkan...' : 'Cek Data Cloud'}</span>
          </button>

          {/* User Profile Badge */}
          {user && (
            <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-800 flex items-center justify-center font-bold text-xs">
                  {user.displayName.charAt(0)}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {user.displayName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                title="Ganti pengguna / Keluar"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
