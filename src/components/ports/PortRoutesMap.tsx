import React, { useState } from 'react';
import { 
  Anchor, 
  Ship, 
  MapPin, 
  Navigation, 
  Info, 
  ArrowRight, 
  Compass,
  Gauge
} from 'lucide-react';
import type { Vessel, Voyage } from '../../types/shipping';

interface PortRoutesMapProps {
  vessels: Vessel[];
  voyages: Voyage[];
}

interface PortInfo {
  code: string;
  name: string;
  city: string;
  island: string;
  draftDepthMeters: number;
  craneCapacityTon: number;
  coordinates: { x: number; y: number }; // Percentage on Indonesia map layout
}

const INDONESIA_PORTS: PortInfo[] = [
  {
    code: 'IDTPP',
    name: 'Pelabuhan Tanjung Priok',
    city: 'Jakarta Utara',
    island: 'Jawa',
    draftDepthMeters: 14.5,
    craneCapacityTon: 65,
    coordinates: { x: 30, y: 72 },
  },
  {
    code: 'IDSUB',
    name: 'Pelabuhan Tanjung Perak',
    city: 'Surabaya',
    island: 'Jawa',
    draftDepthMeters: 12.0,
    craneCapacityTon: 50,
    coordinates: { x: 45, y: 77 },
  },
  {
    code: 'IDBLW',
    name: 'Pelabuhan Belawan',
    city: 'Medan',
    island: 'Sumatera',
    draftDepthMeters: 11.5,
    craneCapacityTon: 45,
    coordinates: { x: 12, y: 32 },
  },
  {
    code: 'IDBTM',
    name: 'Pelabuhan Batu Ampar',
    city: 'Batam',
    island: 'Kepulauan Riau',
    draftDepthMeters: 13.0,
    craneCapacityTon: 55,
    coordinates: { x: 23, y: 46 },
  },
  {
    code: 'IDMAK',
    name: 'Pelabuhan Soekarno-Hatta',
    city: 'Makassar',
    island: 'Sulawesi',
    draftDepthMeters: 12.5,
    craneCapacityTon: 50,
    coordinates: { x: 62, y: 65 },
  },
  {
    code: 'IDBPN',
    name: 'Pelabuhan Semayang',
    city: 'Balikpapan',
    island: 'Kalimantan',
    draftDepthMeters: 13.5,
    craneCapacityTon: 45,
    coordinates: { x: 54, y: 50 },
  },
  {
    code: 'IDSOQ',
    name: 'Pelabuhan Sorong',
    city: 'Sorong',
    island: 'Papua Barat',
    draftDepthMeters: 11.0,
    craneCapacityTon: 40,
    coordinates: { x: 86, y: 52 },
  },
];

export function PortRoutesMap({ vessels, voyages }: PortRoutesMapProps) {
  const [selectedPort, setSelectedPort] = useState<PortInfo>(INDONESIA_PORTS[0]);

  // Vessels matching the selected port
  const vesselsAtPort = vessels.filter(
    (v) =>
      v.currentPort.toLowerCase().includes(selectedPort.city.toLowerCase()) ||
      v.currentPort.toLowerCase().includes(selectedPort.name.toLowerCase())
  );

  const voyagesToPort = voyages.filter(
    (voy) =>
      voy.destinationPort.toLowerCase().includes(selectedPort.city.toLowerCase()) ||
      voy.destinationPort.toLowerCase().includes(selectedPort.name.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Peta Rute ALKI & Jaringan Pelabuhan
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800">
              7 Hub Maritim Utama
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualisasi alur pelayaran nusantara, kedalaman dermaga, dan armada yang sedang bersandar
          </p>
        </div>
      </div>

      {/* Visual Map Area */}
      <div className="bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden min-h-[360px] flex flex-col justify-between">
        
        {/* Maritime Grid Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Status Indicators */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span>Alur Laut Kepulauan Indonesia (ALKI I, II, III) Terpantau Normal</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Hub Pelabuhan</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kapal Berlayar</span>
            </span>
          </div>
        </div>

        {/* Interactive Port Markers Container */}
        <div className="relative z-10 my-8 h-64 sm:h-72 w-full border border-cyan-800/40 rounded-xl bg-cyan-950/30 backdrop-blur-xs relative overflow-hidden">
          
          {/* Schematic Coastlines Representation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <span className="text-5xl sm:text-7xl font-black text-cyan-400 uppercase tracking-widest">
              NUSANTARA
            </span>
          </div>

          {/* Port Nodes */}
          {INDONESIA_PORTS.map((port) => {
            const isSelected = selectedPort.code === port.code;
            return (
              <button
                key={port.code}
                onClick={() => setSelectedPort(port)}
                style={{
                  left: `${port.coordinates.x}%`,
                  top: `${port.coordinates.y}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 z-20`}
              >
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-lg ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/40 scale-110'
                      : 'bg-slate-800/90 text-white border border-cyan-500/40 hover:bg-cyan-700 hover:scale-105'
                  }`}
                >
                  <Anchor className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span className="whitespace-nowrap font-mono">{port.city}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Selected Port Summary Bar */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-slate-950">
                {selectedPort.code}
              </span>
              <h4 className="text-base font-bold text-white">{selectedPort.name}</h4>
              <span className="text-xs text-cyan-300">({selectedPort.island})</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Kedalaman Dermaga: <strong>{selectedPort.draftDepthMeters} m</strong> • Kapasitas Derek: <strong>{selectedPort.craneCapacityTon} Ton</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="text-right">
              <span className="text-slate-300 block text-[10px]">Kapal di Dermaga</span>
              <span className="text-cyan-400 font-bold text-sm">{vesselsAtPort.length} Unit</span>
            </div>
            <div className="text-right">
              <span className="text-slate-300 block text-[10px]">Jadwal Menuju Pelabuhan</span>
              <span className="text-emerald-400 font-bold text-sm">{voyagesToPort.length} Pelayaran</span>
            </div>
          </div>
        </div>

      </div>

      {/* Port Activity Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Vessels currently at selected port */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Ship className="w-5 h-5 text-cyan-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Kapal yang Sedang Berada di {selectedPort.city}
            </h3>
          </div>

          {vesselsAtPort.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              Tidak ada kapal armada yang saat ini tercatat di pelabuhan ini.
            </div>
          ) : (
            <div className="space-y-2.5">
              {vesselsAtPort.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{v.name}</h4>
                    <p className="text-[11px] text-slate-500">{v.type} • {v.capacityDwt.toLocaleString()} DWT</p>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming Voyages to Selected Port */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Navigation className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Jadwal Kapal Masuk (Incoming ETA) ke {selectedPort.city}
            </h3>
          </div>

          {voyagesToPort.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              Belum ada jadwal pelayaran terdaftar yang menuju pelabuhan ini.
            </div>
          ) : (
            <div className="space-y-2.5">
              {voyagesToPort.map((voy) => (
                <div
                  key={voy.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {voy.voyageNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{voy.vesselName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Dari: {voy.originPort}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-emerald-700 block">
                      {voy.status}
                    </span>
                    <span className="text-[10px] text-slate-400">{voy.distanceNm} NM</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
