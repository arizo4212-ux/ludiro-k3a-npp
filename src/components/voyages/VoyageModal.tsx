import React, { useState, useEffect } from 'react';
import { X, Navigation, Save, Calendar, MapPin, Ship } from 'lucide-react';
import type { Voyage, VoyageStatus, Vessel } from '../../types/shipping';

interface VoyageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voyageData: Omit<Voyage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Voyage | null;
  vessels: Vessel[];
}

export function VoyageModal({ isOpen, onClose, onSave, initialData, vessels }: VoyageModalProps) {
  const [voyageNumber, setVoyageNumber] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [vesselId, setVesselId] = useState('');
  const [originPort, setOriginPort] = useState('Tanjung Priok (Jakarta)');
  const [destinationPort, setDestinationPort] = useState('Tanjung Perak (Surabaya)');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [distanceNm, setDistanceNm] = useState<number>(410);
  const [status, setStatus] = useState<VoyageStatus>('Scheduled');
  const [cargoTonnes, setCargoTonnes] = useState<number>(15000);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setVoyageNumber(initialData.voyageNumber);
      setVesselName(initialData.vesselName);
      setVesselId(initialData.vesselId || '');
      setOriginPort(initialData.originPort);
      setDestinationPort(initialData.destinationPort);
      setDepartureDate(initialData.departureDate ? initialData.departureDate.substring(0, 16) : '');
      setArrivalDate(initialData.arrivalDate ? initialData.arrivalDate.substring(0, 16) : '');
      setDistanceNm(initialData.distanceNm || 0);
      setStatus(initialData.status);
      setCargoTonnes(initialData.cargoTonnes || 0);
      setNotes(initialData.notes || '');
    } else {
      const now = new Date();
      const dep = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const arr = new Date(dep.getTime() + 48 * 60 * 60 * 1000);

      setVoyageNumber(`VYG-2026-${Math.floor(100 + Math.random() * 900)}`);
      setVesselName(vessels.length > 0 ? vessels[0].name : 'MV Nusantara Perdana');
      setVesselId(vessels.length > 0 ? vessels[0].id : '');
      setOriginPort('Tanjung Priok (Jakarta)');
      setDestinationPort('Tanjung Perak (Surabaya)');
      setDepartureDate(dep.toISOString().substring(0, 16));
      setArrivalDate(arr.toISOString().substring(0, 16));
      setDistanceNm(410);
      setStatus('Scheduled');
      setCargoTonnes(12500);
      setNotes('Jalur ALKI aman. Periksa muatan dan laporan stabilitas kapal.');
    }
    setErrors({});
  }, [initialData, isOpen, vessels]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!voyageNumber.trim() || voyageNumber.trim().length < 3) {
      errs.voyageNumber = 'Kode pelayaran minimal 3 karakter';
    }

    if (!vesselName.trim()) {
      errs.vesselName = 'Nama kapal wajib dipilih';
    }

    if (!originPort.trim()) {
      errs.originPort = 'Pelabuhan asal wajib diisi';
    }

    if (!destinationPort.trim()) {
      errs.destinationPort = 'Pelabuhan tujuan wajib diisi';
    }

    if (originPort.trim().toLowerCase() === destinationPort.trim().toLowerCase()) {
      errs.destinationPort = 'Pelabuhan asal dan tujuan tidak boleh sama';
    }

    if (!departureDate) {
      errs.departureDate = 'Waktu keberangkatan (ETD) wajib diisi';
    }

    if (!arrivalDate) {
      errs.arrivalDate = 'Waktu kedatangan (ETA) wajib diisi';
    }

    if (departureDate && arrivalDate) {
      const dep = new Date(departureDate).getTime();
      const arr = new Date(arrivalDate).getTime();
      if (arr <= dep) {
        errs.arrivalDate = 'Waktu kedatangan (ETA) harus lebih lambat dari keberangkatan (ETD)';
      }
    }

    if (distanceNm <= 0) {
      errs.distanceNm = 'Jarak mil laut harus lebih besar dari 0';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleVesselChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setVesselName(selectedName);
    const found = vessels.find((v) => v.name === selectedName);
    if (found) {
      setVesselId(found.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        voyageNumber: voyageNumber.trim().toUpperCase(),
        vesselName: vesselName.trim(),
        vesselId: vesselId || 'general',
        originPort: originPort.trim(),
        destinationPort: destinationPort.trim(),
        departureDate,
        arrivalDate,
        distanceNm: Number(distanceNm),
        status,
        cargoTonnes: Number(cargoTonnes),
        notes: notes.trim() || undefined,
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Ubah Rute & Jadwal Pelayaran' : 'Jadwalkan Pelayaran Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Penjadwalan rute pelayaran kapal antar pelabuhan maritim
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
            {/* Voyage Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor / Kode Pelayaran (Voyage No.) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={voyageNumber}
                onChange={(e) => setVoyageNumber(e.target.value)}
                placeholder="VYG-2026-JKT-SBY-042"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.voyageNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-cyan-500'
                }`}
              />
              {errors.voyageNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.voyageNumber}</p>}
            </div>

            {/* Kapal yang Ditugaskan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kapal Pengangkut <span className="text-rose-500">*</span>
              </label>
              {vessels.length > 0 ? (
                <select
                  value={vesselName}
                  onChange={handleVesselChange}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                >
                  {vessels.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} ({v.type} - {v.capacityDwt.toLocaleString()} DWT)
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  placeholder="MV Nusantara Perdana"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              )}
              {errors.vesselName && <p className="text-[11px] text-rose-500 mt-1">{errors.vesselName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pelabuhan Asal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pelabuhan Asal Keberangkatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={originPort}
                onChange={(e) => setOriginPort(e.target.value)}
                placeholder="Tanjung Priok (Jakarta)"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              {errors.originPort && <p className="text-[11px] text-rose-500 mt-1">{errors.originPort}</p>}
            </div>

            {/* Pelabuhan Tujuan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pelabuhan Tujuan Kedatangan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                placeholder="Tanjung Perak (Surabaya)"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              {errors.destinationPort && <p className="text-[11px] text-rose-500 mt-1">{errors.destinationPort}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ETD */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimasi Waktu Berangkat (ETD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              {errors.departureDate && <p className="text-[11px] text-rose-500 mt-1">{errors.departureDate}</p>}
            </div>

            {/* ETA */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimasi Waktu Tiba (ETA) <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              {errors.arrivalDate && <p className="text-[11px] text-rose-500 mt-1">{errors.arrivalDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Jarak Mil Laut */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jarak Tempuh (Nautical Miles) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={distanceNm}
                onChange={(e) => setDistanceNm(Number(e.target.value))}
                placeholder="410"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              {errors.distanceNm && <p className="text-[11px] text-rose-500 mt-1">{errors.distanceNm}</p>}
            </div>

            {/* Muatan Kargo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Tonase Muatan (Ton)
              </label>
              <input
                type="number"
                value={cargoTonnes}
                onChange={(e) => setCargoTonnes(Number(e.target.value))}
                placeholder="15000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Status Pelayaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Pelayaran
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VoyageStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              >
                <option value="Scheduled">🗓️ Terjadwal (Scheduled)</option>
                <option value="In Transit">🚢 Dalam Pelayaran (In Transit)</option>
                <option value="Arrived">⚓ Telah Tiba di Pelabuhan (Arrived)</option>
                <option value="Completed">✅ Selesai Bongkar (Completed)</option>
                <option value="Delayed">⚠️ Ditunda / Cuaca Buruk (Delayed)</option>
              </select>
            </div>
          </div>

          {/* Catatan Navigasi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Operasional & Alur Laut
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan rute navigasi, koordinasi pandu pelabuhan, kondisi cuaca..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
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
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan Rute...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{initialData ? 'Perbarui Jadwal' : 'Simpan Jadwal Pelayaran'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
