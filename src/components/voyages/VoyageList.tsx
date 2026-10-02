import { useState } from 'react';
import { 
  Navigation, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  Ship, 
  MapPin, 
  Weight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import type { Voyage, VoyageStatus } from '../../types/shipping';

interface VoyageListProps {
  voyages: Voyage[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (voyage: Voyage) => void;
  onDelete: (voyage: Voyage) => void;
}

export function VoyageList({ voyages, isLoading, onAdd, onEdit, onDelete }: VoyageListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredVoyages = voyages.filter((voy) => {
    const matchesSearch =
      voy.voyageNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voy.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voy.originPort.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voy.destinationPort.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || voy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: VoyageStatus) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Dalam Pelayaran
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Terjadwal
          </span>
        );
      case 'Arrived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Tiba di Pelabuhan
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            Selesai
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            Ditunda
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Rute & Jadwal Pelayaran
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {voyages.length} Rute Terjadwal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penjadwalan keberangkatan (ETD), estimasi tiba (ETA), rute ALKI, dan monitoring logistik kargo
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Pelayaran Baru</span>
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
            placeholder="Cari kode pelayaran, nama kapal, atau nama pelabuhan..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">Semua Status ({voyages.length})</option>
            <option value="Scheduled">Terjadwal</option>
            <option value="In Transit">Dalam Pelayaran</option>
            <option value="Arrived">Tiba di Pelabuhan</option>
            <option value="Completed">Selesai</option>
            <option value="Delayed">Ditunda</option>
          </select>
        </div>
      </div>

      {/* Voyages Cards */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Memuat jadwal rute dari Firestore...</p>
        </div>
      ) : filteredVoyages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Rute Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Tidak ada jadwal pelayaran yang sesuai filter.'
              : 'Belum ada jadwal pelayaran di database cloud.'}
          </p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={onAdd}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              Jadwalkan Pelayaran
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredVoyages.map((voyage) => (
            <div
              key={voyage.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Route & Vessel Column */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {voyage.voyageNumber}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                    <Ship className="w-4 h-4 text-cyan-600" />
                    <span>{voyage.vesselName}</span>
                  </div>
                  <div>{getStatusBadge(voyage.status)}</div>
                </div>

                {/* Ports Route Pathway */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold shrink-0">
                      A
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Pelabuhan Asal</p>
                      <p className="text-xs font-bold text-slate-800">{voyage.originPort}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 px-2">
                    <div className="h-0.5 w-8 bg-slate-300 hidden sm:block" />
                    <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                      {voyage.distanceNm} NM
                    </span>
                    <div className="h-0.5 w-8 bg-slate-300 hidden sm:block" />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                      B
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Pelabuhan Tujuan</p>
                      <p className="text-xs font-bold text-slate-800">{voyage.destinationPort}</p>
                    </div>
                  </div>
                </div>

                {/* Dates & Cargo row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 font-medium">ETD:</span>
                    <span className="font-semibold text-slate-800">{formatDate(voyage.departureDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 font-medium">ETA:</span>
                    <span className="font-semibold text-slate-800">{formatDate(voyage.arrivalDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Weight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 font-medium">Muatan:</span>
                    <span className="font-semibold text-slate-800">{voyage.cargoTonnes.toLocaleString()} Ton</span>
                  </div>
                </div>

                {voyage.notes && (
                  <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    "{voyage.notes}"
                  </p>
                )}
              </div>

              {/* Actions Column */}
              <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:border-slate-100 sm:pl-4">
                <button
                  onClick={() => onEdit(voyage)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ubah Jadwal</span>
                </button>
                <button
                  onClick={() => onDelete(voyage)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
