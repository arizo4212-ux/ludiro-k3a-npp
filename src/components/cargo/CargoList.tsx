import { useState } from 'react';
import { 
  Box, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Anchor,
  Layers
} from 'lucide-react';
import type { Cargo, CargoStatus, CargoType } from '../../types/shipping';

interface CargoListProps {
  cargoList: Cargo[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (cargo: Cargo) => void;
  onDelete: (cargo: Cargo) => void;
}

export function CargoList({ cargoList, isLoading, onAdd, onEdit, onDelete }: CargoListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredCargo = cargoList.filter((c) => {
    const matchesSearch =
      c.billOfLading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.consignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.voyageNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vesselName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || c.cargoType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: CargoStatus) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Dalam Perjalanan
          </span>
        );
      case 'Loaded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Termuat di Kapal
          </span>
        );
      case 'Pending Loading':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            Menunggu Muat
          </span>
        );
      case 'Discharged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3 text-blue-500" />
            Telah Dibongkar
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            Diterima
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
              Manifest Muatan & Kargo (Bill of Lading)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {cargoList.length} B/L Aktif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan legalitas muatan pengirim, penerima, kontainer peti kemas, dan kargo curah
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Bill of Lading (B/L)</span>
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
            placeholder="Cari nomor B/L, shipper, consignee, atau kapal..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
          >
            <option value="ALL">Semua Status ({cargoList.length})</option>
            <option value="Pending Loading">Menunggu Muat</option>
            <option value="Loaded">Termuat</option>
            <option value="In Transit">Dalam Pelayaran</option>
            <option value="Discharged">Telah Dibongkar</option>
            <option value="Delivered">Telah Diterima</option>
          </select>
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium shrink-0">Jenis:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
          >
            <option value="ALL">Semua Jenis</option>
            <option value="Dry Container">Dry Container</option>
            <option value="Reefer Container">Reefer (Dingin)</option>
            <option value="Liquid Bulk">Liquid Bulk</option>
            <option value="Dry Bulk">Dry Bulk</option>
            <option value="General Cargo">General Cargo</option>
            <option value="Heavy Equipment">Heavy Equipment</option>
          </select>
        </div>

      </div>

      {/* Cargo Manifest Cards */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Memuat manifest muatan dari Firestore...</p>
        </div>
      ) : filteredCargo.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Manifest Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Tidak ada muatan kargo yang cocok dengan kriteria filter.'
              : 'Belum ada data manifest kargo di database.'}
          </p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={onAdd}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
            >
              Terbitkan B/L Pertama
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCargo.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header Manifest */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {item.billOfLading}
                      </span>
                      {item.hazardous && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          DG / Berbahaya
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Pelayaran: <strong className="text-slate-800 font-mono">{item.voyageNumber}</strong> • {item.vesselName}
                    </p>
                  </div>
                  <div>{getStatusBadge(item.status)}</div>
                </div>

                {/* Shipper & Consignee Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2 mb-3.5">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase w-16 shrink-0 mt-0.5">Pengirim:</span>
                    <span className="font-semibold text-slate-800 leading-snug">{item.shipper}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase w-16 shrink-0 mt-0.5">Penerima:</span>
                    <span className="font-semibold text-slate-800 leading-snug">{item.consignee}</span>
                  </div>
                </div>

                {/* Cargo Details Grid */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs text-slate-700 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Jenis Kargo</span>
                    <span className="font-bold text-slate-800">{item.cargoType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Jumlah Unit</span>
                    <span className="font-bold text-slate-800">{item.quantity} Unit/Box</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Total Tonase</span>
                    <span className="font-bold text-slate-800">{item.weightTons.toLocaleString()} Ton</span>
                  </div>
                </div>

                {item.specialInstructions && (
                  <p className="text-xs text-slate-600 bg-amber-50/60 p-2 rounded-lg border border-amber-100 mb-3">
                    <strong className="text-amber-800 font-semibold">Instruksi:</strong> {item.specialInstructions}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Vol: {item.volumeCbm ? `${item.volumeCbm.toLocaleString()} CBM` : '-'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(item)}
                    title="Ubah manifest kargo"
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    title="Batalkan manifest"
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
