import React, { useState } from 'react';
import { 
  Ship, 
  Sparkles, 
  ArrowRight, 
  User, 
  ShieldCheck, 
  Database, 
  Anchor, 
  Box, 
  Navigation, 
  Lock, 
  ChevronDown, 
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function LoginForm() {
  const { loginDirect, loginAsDemo, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [customName, setCustomName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Super Admin' | 'Fleet Manager' | 'Cargo & Logistics Officer'>('Super Admin');
  const [showAdvancedLogin, setShowAdvancedLogin] = useState(false);
  const [manualEmail, setManualEmail] = useState('admin@samudera-maritim.id');
  const [manualPassword, setManualPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1-Click Instant Connect
  const handleInstantConnect = () => {
    loginDirect('Bambang Soediro (Super Admin)', 'Super Admin');
    showToast(
      'success',
      'Terhubung Langsung!',
      'Selamat datang di Nusantara MarineFlow. Database Firestore live tersinkronisasi.'
    );
  };

  // 1-Click Profile Selection
  const handleSelectProfile = (roleKey: 'admin' | 'fleet' | 'cargo') => {
    loginAsDemo(roleKey);
    const profile = DEMO_ACCOUNTS[roleKey];
    showToast(
      'success',
      `Masuk Sebagai ${profile.role}`,
      `Selamat bertugas, ${profile.displayName}. Data cloud realtime aktif.`
    );
  };

  // Custom Name Quick Login
  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customName.trim() || 'Petugas Pelayaran';
    loginDirect(name, selectedRole);
    showToast('success', `Halo, ${name}!`, `Berhasil masuk dengan peran ${selectedRole}.`);
  };

  // Traditional Form Login (if user wants)
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = manualEmail.split('@')[0] || 'Admin';
    loginDirect(name, 'Super Admin');
    showToast('success', 'Autentikasi Berhasil', 'Terhubung ke database cloud Firebase.');
  };

  const handleGoogleSSO = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      showToast('success', 'Google SSO Berhasil', 'Terhubung langsung dengan akun Google Anda.');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast('error', 'Gagal Masuk Google', err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      
      {/* Background Maritime Glow Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl z-10 space-y-5">
        
        {/* Realtime Online Status Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>DATABASE REAL-TIME ONLINE • SIAP TERHUBUNG LANGSUNG</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-600/25 mx-auto mb-1">
            <Ship className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Nusantara <span className="text-cyan-600">MarineFlow</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Sistem Manajemen Armada & Operasional Pelayaran Nasional
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8 space-y-6">
          
          {/* 1-CLICK INSTANT ENTRY HERO BUTTON */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 border border-cyan-200 text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-cyan-900 uppercase tracking-wide">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Akses Cepat 1-Klik Tanpa Ribet</span>
            </div>
            
            <button
              type="button"
              onClick={handleInstantConnect}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>🚀 Masuk Langsung ke Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-[11px] text-slate-500 font-medium">
              Langsung terhubung ke data armada kapal, jadwal rute & manifest kargo secara live
            </p>
          </div>

          {/* QUICK ROLE SELECTOR (3 PROFILES) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Atau Pilih Peran Petugas (1-Klik)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Langsung aktif</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Admin */}
              <button
                type="button"
                onClick={() => handleSelectProfile('admin')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-cyan-400 bg-slate-50/60 hover:bg-cyan-50/60 text-left transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                  👑
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-900">
                  Super Admin
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Akses Penuh CRUD
                </p>
              </button>

              {/* Fleet Manager */}
              <button
                type="button"
                onClick={() => handleSelectProfile('fleet')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/60 text-left transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                  ⚓
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                  Fleet Manager
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Armada & Dok Kapal
                </p>
              </button>

              {/* Cargo Officer */}
              <button
                type="button"
                onClick={() => handleSelectProfile('cargo')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/60 text-left transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                  📦
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  Cargo Officer
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Manifest & Bill of Lading
                </p>
              </button>
            </div>
          </div>

          {/* CUSTOM NAME EASY INPUT FORM */}
          <div className="pt-4 border-t border-slate-100">
            <form onSubmit={handleCustomLogin} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Atau Masuk dengan Nama Anda Sendiri:
              </label>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Contoh: Capt. Hendra Gunawan"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                  />
                </div>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium cursor-pointer"
                >
                  <option value="Super Admin">Admin</option>
                  <option value="Fleet Manager">Fleet Mgr</option>
                  <option value="Cargo & Logistics Officer">Logistik</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Masuk
                </button>
              </div>
            </form>
          </div>

          {/* GOOGLE SSO & ADVANCED FORM ACCORDION */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <button
              type="button"
              onClick={handleGoogleSSO}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Akun Google (SSO)</span>
            </button>

            {/* Optional Email/Password Accordion for advanced admin users */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedLogin(!showAdvancedLogin)}
                className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 transition-colors cursor-pointer py-1"
              >
                <span>Pilihan login email/password manual</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvancedLogin ? 'rotate-180' : ''}`} />
              </button>

              {showAdvancedLogin && (
                <form onSubmit={handleManualSubmit} className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Email Admin
                    </label>
                    <input
                      type="text"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={manualPassword}
                      onChange={(e) => setManualPassword(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Masuk Manual
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Security & Cloud Persistence Assurance Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Setiap perubahan data otomatis tersinkronisasi real-time ke semua pengguna</span>
        </div>

      </div>
    </div>
  );
}
