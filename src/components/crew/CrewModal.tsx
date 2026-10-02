import React, { useState, useEffect } from 'react';
import { X, UserCheck, Save } from 'lucide-react';
import type { CrewMember, CrewRank, CrewStatus, Vessel } from '../../types/shipping';

interface CrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (crewData: Omit<CrewMember, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: CrewMember | null;
  vessels: Vessel[];
}

export function CrewModal({ isOpen, onClose, onSave, initialData, vessels }: CrewModalProps) {
  const [fullName, setFullName] = useState('');
  const [seamanBookNo, setSeamanBookNo] = useState('');
  const [rank, setRank] = useState<CrewRank>('Nakhoda (Master)');
  const [assignedVessel, setAssignedVessel] = useState('');
  const [status, setStatus] = useState<CrewStatus>('On Duty');
  const [certificateExpiry, setCertificateExpiry] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setSeamanBookNo(initialData.seamanBookNo);
      setRank(initialData.rank);
      setAssignedVessel(initialData.assignedVessel);
      setStatus(initialData.status);
      setCertificateExpiry(initialData.certificateExpiry ? initialData.certificateExpiry.substring(0, 10) : '');
      setContactPhone(initialData.contactPhone || '');
    } else {
      setFullName('');
      setSeamanBookNo(`B.${Math.floor(100000 + Math.random() * 900000)}/IDN/2024`);
      setRank('Mualim I (Chief Officer)');
      setAssignedVessel(vessels.length > 0 ? vessels[0].name : 'MV Nusantara Perdana');
      setStatus('On Duty');
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 4);
      setCertificateExpiry(expiry.toISOString().substring(0, 10));
      setContactPhone('+62 812-');
    }
    setErrors({});
  }, [initialData, isOpen, vessels]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Nama lengkap minimal 2 karakter';
    }

    if (!seamanBookNo.trim() || seamanBookNo.trim().length < 4) {
      errs.seamanBookNo = 'Nomor Buku Pelaut minimal 4 karakter';
    }

    if (!assignedVessel.trim()) {
      errs.assignedVessel = 'Penempatan kapal tugas wajib diisi';
    }

    if (!certificateExpiry) {
      errs.certificateExpiry = 'Masa berlaku sertifikat STCW wajib diisi';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        fullName: fullName.trim(),
        seamanBookNo: seamanBookNo.trim().toUpperCase(),
        rank,
        assignedVessel: assignedVessel.trim(),
        status,
        certificateExpiry,
        contactPhone: contactPhone.trim() || undefined,
      });
      onClose();
    } catch (err) {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Ubah Data Awak Kapal' : 'Pendaftaran Kru Maritim Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Registrasi perwira dan pelaut ke Firestore cloud database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap & Gelar Maritim <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Capt. Haryanto Santoso, M.Mar"
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.fullName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-amber-500'
              }`}
            />
            {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Buku Pelaut (Seaman Book) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={seamanBookNo}
                onChange={(e) => setSeamanBookNo(e.target.value)}
                placeholder="B.049182/IDN/2021"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.seamanBookNo ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-amber-500'
                }`}
              />
              {errors.seamanBookNo && <p className="text-[11px] text-rose-500 mt-1">{errors.seamanBookNo}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pangkat / Jabatan Kapal
              </label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value as CrewRank)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              >
                <option value="Nakhoda (Master)">⚓ Nakhoda (Master/Captain)</option>
                <option value="Mualim I (Chief Officer)">🧭 Mualim I (Chief Officer)</option>
                <option value="Mualim II">🧭 Mualim II</option>
                <option value="Kepala Kamar Mesin (Chief Engineer)">⚙️ Kepala Kamar Mesin (Chief Eng.)</option>
                <option value="Masinis II">⚙️ Masinis II (2nd Engineer)</option>
                <option value="Bosun">⚓ Bosun (Kepala Kelasi)</option>
                <option value="Juru Mudi (AB)">🌊 Juru Mudi (Able Seaman)</option>
                <option value="Oiler">🔧 Oiler / Juru Minyak</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kapal Tugas (Assigned Vessel) <span className="text-rose-500">*</span>
              </label>
              {vessels.length > 0 ? (
                <select
                  value={assignedVessel}
                  onChange={(e) => setAssignedVessel(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                >
                  {vessels.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} ({v.type})
                    </option>
                  ))}
                  <option value="Pool Siaga (Darat)">Pool Siaga (Darat / Standby)</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={assignedVessel}
                  onChange={(e) => setAssignedVessel(e.target.value)}
                  placeholder="MV Nusantara Perdana"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              )}
              {errors.assignedVessel && <p className="text-[11px] text-rose-500 mt-1">{errors.assignedVessel}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Tugas
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CrewStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              >
                <option value="On Duty">🟢 Bertugas di Kapal (On Duty)</option>
                <option value="On Leave">🟡 Sedang Cuti (On Leave)</option>
                <option value="Standby">⚪ Standby di Darat (Cadangan)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Masa Berlaku Sertifikat STCW <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={certificateExpiry}
                onChange={(e) => setCertificateExpiry(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              {errors.certificateExpiry && <p className="text-[11px] text-rose-500 mt-1">{errors.certificateExpiry}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kontak Darurat / No. Telepon
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+62 812-3456-7890"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan Kru...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{initialData ? 'Perbarui Awak Kapal' : 'Daftarkan Kru Maritim'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
