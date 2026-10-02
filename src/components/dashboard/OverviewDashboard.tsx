import { 
  Ship, 
  Navigation, 
  Box, 
  Users, 
  ArrowUpRight, 
  Anchor, 
  Compass, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Activity,
  Layers,
  Database
} from 'lucide-react';
import type { Vessel, Voyage, Cargo, CrewMember } from '../../types/shipping';

interface OverviewDashboardProps {
  vessels: Vessel[];
  voyages: Voyage[];
  cargoList: Cargo[];
  crewList: CrewMember[];
  onNavigateTab: (tab: 'vessels' | 'voyages' | 'cargo' | 'crew' | 'routes') => void;
  onAddVessel: () => void;
  onAddVoyage: () => void;
  onAddCargo: () => void;
  onAddCrew: () => void;
}

export function OverviewDashboard({
  vessels,
  voyages,
  cargoList,
  crewList,
  onNavigateTab,
  onAddVessel,
  onAddVoyage,
  onAddCargo,
  onAddCrew,
}: OverviewDashboardProps) {
  // Computed KPIs
  const sailingVessels = vessels.filter((v) => v.status === 'Sailing').length;
  const berthedVessels = vessels.filter((v) => v.status === 'Berthed').length;
  const maintenanceVessels = vessels.filter((v) => v.status === 'Maintenance').length;

  const inTransitVoyages = voyages.filter((voy) => voy.status === 'In Transit').length;
  const scheduledVoyages = voyages.filter((voy) => voy.status === 'Scheduled').length;

  const totalCargoTons = cargoList.reduce((acc, curr) => acc + (curr.weightTons || 0), 0);
  const inTransitCargo = cargoList.filter((c) => c.status === 'In Transit').length;

  const onDutyCrew = crewList.filter((c) => c.status === 'On Duty').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <Ship className="w-80 h-80" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="w-3.5 h-3.5" />
            <span>Pusat Komando Maritim • Terhubung ke Firebase Cloud Firestore</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Ringkasan Operasional Samudera
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Monitoring armada kapal peti kemas & curah, status rute Alur Laut Kepulauan Indonesia (ALKI), kepabeanan kargo Bill of Lading, serta penugasan kru maritim secara langsung.
          </p>

          {/* Quick Actions Buttons */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={onAddVessel}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Tambah Kapal</span>
            </button>
            <button
              onClick={onAddVoyage}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Jadwal Pelayaran</span>
            </button>
            <button
              onClick={onAddCargo}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Terbitkan B/L</span>
            </button>
            <button
              onClick={onAddCrew}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Daftarkan Kru</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Armada Kapal */}
        <div 
          onClick={() => onNavigateTab('vessels')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Ship className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-cyan-700 flex items-center gap-0.5">
              <span>Kelola</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">Armada Kapal</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{vessels.length}</span>
            <span className="text-xs text-slate-400">Unit Kapal</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {sailingVessels} Berlayar
            </span>
            <span>{berthedVessels} Sandar</span>
            <span className="text-slate-400">{maintenanceVessels} Dok</span>
          </div>
        </div>

        {/* Rute & Pelayaran */}
        <div 
          onClick={() => onNavigateTab('voyages')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-blue-700 flex items-center gap-0.5">
              <span>Kelola</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">Jadwal Pelayaran</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{voyages.length}</span>
            <span className="text-xs text-slate-400">Rute Aktif</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {inTransitVoyages} In Transit
            </span>
            <span>{scheduledVoyages} Terjadwal</span>
          </div>
        </div>

        {/* Manifest Muatan */}
        <div 
          onClick={() => onNavigateTab('cargo')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-0.5">
              <span>Kelola</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">Muatan Kargo (B/L)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{cargoList.length}</span>
            <span className="text-xs text-slate-400">Manifest B/L</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{totalCargoTons.toLocaleString()} Ton Kargo</span>
            <span className="text-emerald-700 font-semibold">{inTransitCargo} Berjalan</span>
          </div>
        </div>

        {/* Awak Kapal */}
        <div 
          onClick={() => onNavigateTab('crew')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-amber-700 flex items-center gap-0.5">
              <span>Kelola</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">Awak Kapal Maritim</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{crewList.length}</span>
            <span className="text-xs text-slate-400">Personel</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {onDutyCrew} Bertugas
            </span>
            <span className="text-slate-400">STCW Standar</span>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Recent Fleet Positions & Live Voyages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Active Ships Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <Anchor className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pergerakan Armada Kapal Terkini</h3>
                <p className="text-[11px] text-slate-500">Status dan posisi pelabuhan saat ini</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('vessels')}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-3">
            {vessels.slice(0, 4).map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{v.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {v.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-cyan-600" />
                    <span>{v.currentPort}</span>
                    {v.destinationPort && (
                      <>
                        <span>→</span>
                        <span>{v.destinationPort}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      v.status === 'Sailing'
                        ? 'bg-emerald-100 text-emerald-800'
                        : v.status === 'Berthed'
                        ? 'bg-blue-100 text-blue-800'
                        : v.status === 'Maintenance'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {v.status === 'Sailing' ? '🚢 Berlayar' : v.status === 'Berthed' ? '⚓ Bersandar' : v.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{v.speedKnots} Knot</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Voyages & Cargo Highlights */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Jadwal Keberangkatan Terdekat</h3>
                <p className="text-[11px] text-slate-500">Estimasi keberangkatan & muatan kapal</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('voyages')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-3">
            {voyages.slice(0, 4).map((voy) => (
              <div
                key={voy.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      {voy.voyageNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{voy.vesselName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {voy.originPort} → {voy.destinationPort}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {voy.cargoTonnes.toLocaleString()} Ton
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {voy.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Indonesian Sea Shipping Corridors & System Info */}
      <div className="bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 border border-cyan-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Konektivitas ALKI I, II & III Maritim Nusantara
            </h4>
            <p className="text-xs text-slate-600">
              Sistem telah terintegrasi dengan standar pelabuhan Tanjung Priok, Tanjung Perak, Belawan, Makassar, dan Balikpapan dengan database Firebase Firestore.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('routes')}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-cyan-300 text-cyan-800 font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
        >
          Lihat Peta Rute Maritim →
        </button>
      </div>

    </div>
  );
}
