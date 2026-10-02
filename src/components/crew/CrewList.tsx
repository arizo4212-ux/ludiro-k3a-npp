import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Phone, 
  Ship, 
  Award,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import type { CrewMember, CrewRank, CrewStatus } from '../../types/shipping';

interface CrewListProps {
  crewList: CrewMember[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (crew: CrewMember) => void;
  onDelete: (crew: CrewMember) => void;
}

export function CrewList({ crewList, isLoading, onAdd, onEdit, onDelete }: CrewListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredCrew = crewList.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.seamanBookNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedVessel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rank.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CrewStatus) => {
    switch (status) {
      case 'On Duty':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Bertugas di Kapal
          </span>
        );
      case 'On Leave':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Sedang Cuti
          </span>
        );
      case 'Standby':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Standby / Pool
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Awak Kapal & Kru Maritim
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {crewList.length} Kru Terdaftar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data perwira, nakhoda, juru mesin, buku pelaut, dan masa berlaku sertifikasi STCW internasional
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Daftarkan Kru Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pelaut, nomor buku pelaut, pangkat, atau kapal..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">Semua Status ({crewList.length})</option>
            <option value="On Duty">Bertugas</option>
            <option value="On Leave">Cuti</option>
            <option value="Standby">Standby</option>
          </select>
        </div>
      </div>

      {/* Crew Cards */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Memuat kru kapal dari Firestore...</p>
        </div>
      ) : filteredCrew.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Awak Kapal Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Tidak ada kru yang cocok dengan filter pencarian.'
              : 'Belum ada data kru maritim di database.'}
          </p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={onAdd}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
            >
              Daftarkan Kru Pertama
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrew.map((crew) => (
            <div
              key={crew.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {crew.seamanBookNo}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5 line-clamp-1">
                      {crew.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 mt-0.5">
                      {crew.rank}
                    </p>
                  </div>
                  <div>{getStatusBadge(crew.status)}</div>
                </div>

                {/* Details Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <Ship className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span className="text-slate-400 font-medium">Penempatan:</span>
                    <span className="font-bold text-slate-800 truncate">{crew.assignedVessel}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-slate-400 font-medium">STCW Exp:</span>
                    <span className="font-semibold text-slate-800">{crew.certificateExpiry}</span>
                  </div>

                  {crew.contactPhone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 font-medium">Kontak:</span>
                      <span className="font-semibold text-slate-800 font-mono">{crew.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  ID: {crew.id.substring(0, 8)}...
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(crew)}
                    title="Ubah data kru"
                    className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(crew)}
                    title="Hapus data kru"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
