import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { CrewMember } from '../../types/shipping';

interface CrewDeleteDialogProps {
  isOpen: boolean;
  crew: CrewMember | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function CrewDeleteDialog({ isOpen, crew, onClose, onConfirm }: CrewDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !crew) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      // Handled
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Hapus Data Awak Kapal</h3>
          <p className="text-xs text-slate-500 mt-2">
            Apakah Anda yakin ingin menghapus catatan pelaut{' '}
            <strong className="text-slate-800 font-bold">{crew.fullName}</strong> ({crew.rank}) dengan Buku Pelaut {crew.seamanBookNo}?
          </p>
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] text-left">
            ⚠️ <strong>Perhatian:</strong> Data profil dan sertifikasi kru maritim ini akan dihapus permanen dari Firestore database.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Data Kru</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
