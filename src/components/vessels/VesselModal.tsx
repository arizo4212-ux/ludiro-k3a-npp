import React, { useState, useEffect } from 'react';
import { X, Ship, AlertCircle, Save, Check } from 'lucide-react';
import type { Vessel, VesselType, VesselStatus } from '../../types/shipping';

interface VesselModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vesselData: Omit<Vessel, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Vessel | null;
}

export function VesselModal({ isOpen, onClose, onSave, initialData }: VesselModalProps) {
  const [name, setName] = useState('');
  const [imoNumber, setImoNumber] = useState('');
  const [type, setType] = useState<VesselType>('Container');
  const [capacityDwt, setCapacityDwt] = useState<number>(25000);
  const [capacityTeu, setCapacityTeu] = useState<number>(1800);
  const [status, setStatus] = useState<VesselStatus>('Berthed');
  const [flag, setFlag] = useState('Indonesia');
  const [yearBuilt, setYearBuilt] = useState<number>(2020);
  const [currentPort, setCurrentPort] = useState('Tanjung Priok, Jakarta');
  const [destinationPort, setDestinationPort] = useState('Tanjung Perak, Surabaya');
  const [speedKnots, setSpeedKnots] = useState<number>(16.5);
  const [fuelConsumptionTonsPerDay, setFuelConsumptionTonsPerDay] = useState<number>(22);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setImoNumber(initialData.imoNumber);
      setType(initialData.type);
      setCapacityDwt(initialData.capacityDwt);
      setCapacityTeu(initialData.capacityTeu || 0);
      setStatus(initialData.status);
      setFlag(initialData.flag || 'Indonesia');
      setYearBuilt(initialData.yearBuilt || 2020);
      setCurrentPort(initialData.currentPort || '');
      setDestinationPort(initialData.destinationPort || '');
      setSpeedKnots(initialData.speedKnots || 15);
      setFuelConsumptionTonsPerDay(initialData.fuelConsumptionTonsPerDay || 20);
    } else {
      // Defaults for new vessel
      setName('');
      setImoNumber('IMO');
      setType('Container');
      setCapacityDwt(25000);
      setCapacityTeu(1800);
      setStatus('Berthed');
      setFlag('Indonesia');
      setYearBuilt(2021);
      setCurrentPort('Tanjung Priok, Jakarta');
      setDestinationPort('Tanjung Perak, Surabaya');
      setSpeedKnots(16.5);
      setFuelConsumptionTonsPerDay(22);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Strict Validation Logic
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Nama kapal minimal 2 karakter';
    } else if (name.trim().length > 100) {
      errs.name = 'Nama kapal maksimal 100 karakter';
    }

    const cleanImo = imoNumber.trim().toUpperCase();
    if (!cleanImo || cleanImo.length < 7 || cleanImo.length > 15) {
      errs.imoNumber = 'Nomor IMO harus valid (contoh: IMO9482103)';
    }

    if (!capacityDwt || capacityDwt <= 0) {
      errs.capacityDwt = 'Kapasitas DWT harus lebih dari 0 ton';
    }

    if (type === 'Container' && (capacityTeu === undefined || capacityTeu < 0)) {
      errs.capacityTeu = 'Kapasitas TEU tidak boleh negatif untuk kapal kontainer';
    }

    const currentYear = new Date().getFullYear();
    if (!yearBuilt || yearBuilt < 1960 || yearBuilt > currentYear + 2) {
      errs.yearBuilt = `Tahun pembuatan harus antara 1960 dan ${currentYear + 2}`;
    }

    if (!currentPort.trim()) {
      errs.currentPort = 'Pelabuhan saat ini wajib diisi';
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
        name: name.trim(),
        imoNumber: imoNumber.trim().toUpperCase(),
        type,
        capacityDwt: Number(capacityDwt),
        capacityTeu: type === 'Container' ? Number(capacityTeu) : undefined,
        status,
        flag: flag.trim() || 'Indonesia',
        yearBuilt: Number(yearBuilt),
        currentPort: currentPort.trim(),
        destinationPort: destinationPort.trim() || undefined,
        speedKnots: Number(speedKnots),
        fuelConsumptionTonsPerDay: Number(fuelConsumptionTonsPerDay),
      });
      onClose();
    } catch (err) {
      // Error handled by parent or services
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
              <Ship className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Ubah Data Armada Kapal' : 'Pendaftaran Kapal Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan registrasi kapal ke database Firestore armada
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Kapal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Kapal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="MV Nusantara Perdana"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-cyan-500'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Nomor IMO */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor IMO <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={imoNumber}
                onChange={(e) => setImoNumber(e.target.value)}
                placeholder="IMO9482103"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all font-mono ${
                  errors.imoNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-cyan-500'
                }`}
              />
              {errors.imoNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.imoNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tipe Kapal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipe Kapal
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VesselType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              >
                <option value="Container">Container (Peti Kemas)</option>
                <option value="Bulk Carrier">Bulk Carrier (Curah Kering)</option>
                <option value="Tanker">Tanker (Curah Cair/Minyak)</option>
                <option value="Ro-Ro">Ro-Ro (Roll-on/Roll-off)</option>
                <option value="General Cargo">General Cargo (Kargo Umum)</option>
              </select>
            </div>

            {/* Status Operasional */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Operasional
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VesselStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              >
                <option value="Sailing">🚢 Sedang Berlayar (Sailing)</option>
                <option value="Berthed">⚓ Bersandar di Pelabuhan (Berthed)</option>
                <option value="Anchored">⚓ Lego Jangkar (Anchored)</option>
                <option value="Maintenance">🛠️ Perawatan / Dok (Maintenance)</option>
              </select>
            </div>

            {/* Tahun Pembuatan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tahun Pembuatan
              </label>
              <input
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(Number(e.target.value))}
                min={1970}
                max={2030}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              {errors.yearBuilt && <p className="text-[11px] text-rose-500 mt-1">{errors.yearBuilt}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kapasitas DWT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kapasitas DWT (Ton) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={capacityDwt}
                onChange={(e) => setCapacityDwt(Number(e.target.value))}
                placeholder="35000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              {errors.capacityDwt && <p className="text-[11px] text-rose-500 mt-1">{errors.capacityDwt}</p>}
            </div>

            {/* Kapasitas TEU (Jika Container) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kapasitas TEU {type === 'Container' && <span className="text-cyan-600">(Kontainer)</span>}
              </label>
              <input
                type="number"
                disabled={type !== 'Container'}
                value={capacityTeu}
                onChange={(e) => setCapacityTeu(Number(e.target.value))}
                placeholder="2800"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pelabuhan Saat Ini */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pelabuhan Saat Ini <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={currentPort}
                onChange={(e) => setCurrentPort(e.target.value)}
                placeholder="Tanjung Priok, Jakarta"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              {errors.currentPort && <p className="text-[11px] text-rose-500 mt-1">{errors.currentPort}</p>}
            </div>

            {/* Pelabuhan Tujuan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pelabuhan Tujuan
              </label>
              <input
                type="text"
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                placeholder="Tanjung Perak, Surabaya"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Kecepatan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kecepatan (Knot)
              </label>
              <input
                type="number"
                step="0.1"
                value={speedKnots}
                onChange={(e) => setSpeedKnots(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Konsumsi BBM */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Konsumsi BBM (Ton/Hari)
              </label>
              <input
                type="number"
                step="0.1"
                value={fuelConsumptionTonsPerDay}
                onChange={(e) => setFuelConsumptionTonsPerDay(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Bendera */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bendera Kebangsaan
              </label>
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
              className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-md shadow-cyan-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan ke Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{initialData ? 'Perbarui Kapal' : 'Simpan Kapal'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
