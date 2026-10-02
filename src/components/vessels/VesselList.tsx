import { useState } from 'react';
import { 
  Ship, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Compass, 
  Gauge, 
  Anchor, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Droplets
} from 'lucide-react';
import type { Vessel, VesselStatus, VesselType } from '../../types/shipping';

interface VesselListProps {
  vessels: Vessel[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (vessel: Vessel) => void;
  onDelete: (vessel: Vessel) => void;
}

export function VesselList({ vessels, isLoading, onAdd, onEdit, onDelete }: VesselListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredVessels = vessels.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.imoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.currentPort.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.destinationPort && v.destinationPort.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || v.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: VesselStatus) => {
    switch (status) {
      case 'Sailing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sedang Berlayar
          </span>
        );
      case 'Berthed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Bersandar di Pelabuhan
          </span>
        );
      case 'Anchored':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Lego Jangkar
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Perawatan / Dok
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Stats & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Armada Kapal Perusahaan
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800">
              {vessels.length} Kapal Terdaftar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data spesifikasi teknis, sertifikasi IMO, dan status pelayaran kapal secara live dari Firestore
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Daftarkan Kapal Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama kapal, nomor IMO, atau pelabuhan..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer"
          >
            <option value="ALL">Semua Status ({vessels.length})</option>
            <option value="Sailing">Sedang Berlayar</option>
            <option value="Berthed">Bersandar</option>
            <option value="Anchored">Lego Jangkar</option>
            <option value="Maintenance">Perawatan Dok</option>
          </select>
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium shrink-0">Tipe:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer"
          >
            <option value="ALL">Semua Tipe</option>
            <option value="Container">Container</option>
            <option value="Bulk Carrier">Bulk Carrier</option>
            <option value="Tanker">Tanker</option>
            <option value="Ro-Ro">Ro-Ro</option>
            <option value="General Cargo">General Cargo</option>
          </select>
        </div>

      </div>

      {/* Vessels Cards / Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Menyinkronkan armada dari Cloud Firestore...</p>
        </div>
      ) : filteredVessels.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Ship className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Kapal Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Tidak ada data kapal yang cocok dengan filter pencarian Anda.'
              : 'Belum ada data kapal tersimpan di database Firestore.'}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={onAdd}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors cursor-pointer"
            >
              Tambah Kapal Sekarang
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVessels.map((vessel) => (
            <div
              key={vessel.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                      {vessel.imoNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5 line-clamp-1">
                      {vessel.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {vessel.type} • Tahun {vessel.yearBuilt}
                    </p>
                  </div>
                  <div>{getStatusBadge(vessel.status)}</div>
                </div>

                {/* Specs Info Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Kapasitas DWT</span>
                    <span className="font-bold text-slate-800">
                      {vessel.capacityDwt.toLocaleString('id-ID')} Ton
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {vessel.type === 'Container' ? 'Kapasitas TEU' : 'Bendera Kapal'}
                    </span>
                    <span className="font-bold text-slate-800">
                      {vessel.type === 'Container' && vessel.capacityTeu
                        ? `${vessel.capacityTeu.toLocaleString('id-ID')} TEU`
                        : vessel.flag || 'Indonesia'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Kecepatan Max</span>
                    <span className="font-semibold text-slate-700">
                      {vessel.speedKnots} Knot
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Konsumsi BBM</span>
                    <span className="font-semibold text-slate-700">
                      {vessel.fuelConsumptionTonsPerDay} T/Hari
                    </span>
                  </div>
                </div>

                {/* Port Locations */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span className="font-medium text-slate-500">Posisi:</span>
                    <span className="font-semibold text-slate-800 truncate">{vessel.currentPort}</span>
                  </div>
                  {vessel.destinationPort && (
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-medium text-slate-500">Tujuan:</span>
                      <span className="font-semibold text-slate-800 truncate">{vessel.destinationPort}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  ID: {vessel.id.substring(0, 8)}...
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(vessel)}
                    title="Ubah data kapal"
                    className="p-1.5 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(vessel)}
                    title="Hapus kapal dari database"
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
