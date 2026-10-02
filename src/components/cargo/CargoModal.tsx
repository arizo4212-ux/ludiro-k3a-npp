import React, { useState, useEffect } from 'react';
import { X, Box, Save, AlertTriangle } from 'lucide-react';
import type { Cargo, CargoType, CargoStatus, Voyage, Vessel } from '../../types/shipping';

interface CargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cargoData: Omit<Cargo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Cargo | null;
  voyages: Voyage[];
  vessels: Vessel[];
}

export function CargoModal({ isOpen, onClose, onSave, initialData, voyages, vessels }: CargoModalProps) {
  const [billOfLading, setBillOfLading] = useState('');
  const [voyageNumber, setVoyageNumber] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [shipper, setShipper] = useState('');
  const [consignee, setConsignee] = useState('');
  const [cargoType, setCargoType] = useState<CargoType>('Dry Container');
  const [quantity, setQuantity] = useState<number>(50);
  const [weightTons, setWeightTons] = useState<number>(850);
  const [volumeCbm, setVolumeCbm] = useState<number>(1400);
  const [status, setStatus] = useState<CargoStatus>('Pending Loading');
  const [hazardous, setHazardous] = useState<boolean>(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setBillOfLading(initialData.billOfLading);
      setVoyageNumber(initialData.voyageNumber || '');
      setVesselName(initialData.vesselName || '');
      setShipper(initialData.shipper);
      setConsignee(initialData.consignee);
      setCargoType(initialData.cargoType);
      setQuantity(initialData.quantity);
      setWeightTons(initialData.weightTons);
      setVolumeCbm(initialData.volumeCbm || 0);
      setStatus(initialData.status);
      setHazardous(initialData.hazardous || false);
      setSpecialInstructions(initialData.specialInstructions || '');
    } else {
      setBillOfLading(`BL-JKT-${Math.floor(10000 + Math.random() * 90000)}`);
      setVoyageNumber(voyages.length > 0 ? voyages[0].voyageNumber : 'VYG-2026-JKT-SBY-042');
      setVesselName(vessels.length > 0 ? vessels[0].name : 'MV Nusantara Perdana');
      setShipper('PT Multi Logistik Indonesia');
      setConsignee('PT Niaga Distribusi Nusantara');
      setCargoType('Dry Container');
      setQuantity(40);
      setWeightTons(680);
      setVolumeCbm(1120);
      setStatus('Pending Loading');
      setHazardous(false);
      setSpecialInstructions('Jaga segel kontainer tetap utuh selama pelayaran');
    }
    setErrors({});
  }, [initialData, isOpen, voyages, vessels]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!billOfLading.trim() || billOfLading.trim().length < 4) {
      errs.billOfLading = 'Nomor Bill of Lading (B/L) minimal 4 karakter';
    }

    if (!shipper.trim() || shipper.trim().length < 2) {
      errs.shipper = 'Nama Pengirim (Shipper) minimal 2 karakter';
    }

    if (!consignee.trim() || consignee.trim().length < 2) {
      errs.consignee = 'Nama Penerima (Consignee) minimal 2 karakter';
    }

    if (!quantity || quantity <= 0) {
      errs.quantity = 'Jumlah unit muatan harus lebih dari 0';
    }

    if (!weightTons || weightTons <= 0) {
      errs.weightTons = 'Berat muatan harus lebih dari 0 ton';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleVoyageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vNum = e.target.value;
    setVoyageNumber(vNum);
    const voy = voyages.find((v) => v.voyageNumber === vNum);
    if (voy) {
      setVesselName(voy.vesselName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        billOfLading: billOfLading.trim().toUpperCase(),
        voyageNumber: voyageNumber.trim(),
        vesselName: vesselName.trim() || 'Kapal Pengangkut',
        shipper: shipper.trim(),
        consignee: consignee.trim(),
        cargoType,
        quantity: Number(quantity),
        weightTons: Number(weightTons),
        volumeCbm: volumeCbm ? Number(volumeCbm) : undefined,
        status,
        hazardous: Boolean(hazardous),
        specialInstructions: specialInstructions.trim() || undefined,
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
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Ubah Data Manifest Kargo' : 'Terbitkan Bill of Lading (B/L) Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan muatan kargo kapal ke Firestore cloud database
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
            {/* Bill of Lading */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Bill of Lading (B/L No.) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={billOfLading}
                onChange={(e) => setBillOfLading(e.target.value)}
                placeholder="BL-JKT-SBY-88219"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.billOfLading ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-500'
                }`}
              />
              {errors.billOfLading && <p className="text-[11px] text-rose-500 mt-1">{errors.billOfLading}</p>}
            </div>

            {/* Nomor Pelayaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jadwal Pelayaran Terkait
              </label>
              {voyages.length > 0 ? (
                <select
                  value={voyageNumber}
                  onChange={handleVoyageSelect}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                >
                  {voyages.map((voy) => (
                    <option key={voy.id} value={voy.voyageNumber}>
                      {voy.voyageNumber} ({voy.vesselName} - {voy.originPort} → {voy.destinationPort})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={voyageNumber}
                  onChange={(e) => setVoyageNumber(e.target.value)}
                  placeholder="VYG-2026-JKT-SBY-042"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shipper */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pengirim (Shipper / Consignor) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={shipper}
                onChange={(e) => setShipper(e.target.value)}
                placeholder="PT Indofood CBP Sukses Makmur Tbk"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.shipper ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-500'
                }`}
              />
              {errors.shipper && <p className="text-[11px] text-rose-500 mt-1">{errors.shipper}</p>}
            </div>

            {/* Consignee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Penerima (Consignee) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={consignee}
                onChange={(e) => setConsignee(e.target.value)}
                placeholder="PT Sumber Alfaria Trijaya Regional Jatim"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.consignee ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-500'
                }`}
              />
              {errors.consignee && <p className="text-[11px] text-rose-500 mt-1">{errors.consignee}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tipe Kargo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jenis Muatan
              </label>
              <select
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value as CargoType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                <option value="Dry Container">📦 Dry Container (Peti Kemas Kering)</option>
                <option value="Reefer Container">❄️ Reefer (Kontainer Dingin)</option>
                <option value="Liquid Bulk">🛢️ Liquid Bulk (Curah Cair/BBM)</option>
                <option value="Dry Bulk">🌾 Dry Bulk (Curah Kering)</option>
                <option value="General Cargo">🏗️ General Cargo (Kargo Umum)</option>
                <option value="Heavy Equipment">🚜 Heavy Equipment (Alat Berat)</option>
              </select>
            </div>

            {/* Status Kargo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Kargo
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CargoStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                <option value="Pending Loading">⏳ Menunggu Pemuatan (Pending)</option>
                <option value="Loaded">🚢 Termuat di Atas Kapal (Loaded)</option>
                <option value="In Transit">🌊 Dalam Pelayaran (In Transit)</option>
                <option value="Discharged">🏗️ Telah Dibongkar (Discharged)</option>
                <option value="Delivered">✅ Diterima Pemilik (Delivered)</option>
              </select>
            </div>

            {/* Jumlah Unit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jumlah Unit / Kontainer <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="40"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {errors.quantity && <p className="text-[11px] text-rose-500 mt-1">{errors.quantity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Berat Tonase */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Berat Kargo (Ton) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={weightTons}
                onChange={(e) => setWeightTons(Number(e.target.value))}
                placeholder="680"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {errors.weightTons && <p className="text-[11px] text-rose-500 mt-1">{errors.weightTons}</p>}
            </div>

            {/* Volume CBM */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Volume Kubikasi (CBM)
              </label>
              <input
                type="number"
                value={volumeCbm}
                onChange={(e) => setVolumeCbm(Number(e.target.value))}
                placeholder="1120"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Hazardous Checkbox */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hazardous}
                onChange={(e) => setHazardous(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Kargo Berbahaya (Dangerous Goods / IMDG Code)
                </span>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Centang bila muatan termasuk bahan kimia, cairan mudah terbakar, atau material eksplosif yang memerlukan penanganan khusus.
                </p>
              </div>
            </label>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instruksi Penanganan Khusus
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Contoh: Suhu reefer wajib stabil -20°C, hindari terkena paparan air langsung..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan Manifest...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{initialData ? 'Perbarui Manifest' : 'Terbitkan Bill of Lading'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
