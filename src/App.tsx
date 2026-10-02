import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { LoginForm } from './components/auth/LoginForm';
import { Navbar } from './components/layout/Navbar';
import { AppTabs, ActiveTab } from './components/layout/AppTabs';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { VesselList } from './components/vessels/VesselList';
import { VesselModal } from './components/vessels/VesselModal';
import { VesselDeleteDialog } from './components/vessels/VesselDeleteDialog';
import { VoyageList } from './components/voyages/VoyageList';
import { VoyageModal } from './components/voyages/VoyageModal';
import { VoyageDeleteDialog } from './components/voyages/VoyageDeleteDialog';
import { CargoList } from './components/cargo/CargoList';
import { CargoModal } from './components/cargo/CargoModal';
import { CargoDeleteDialog } from './components/cargo/CargoDeleteDialog';
import { CrewList } from './components/crew/CrewList';
import { CrewModal } from './components/crew/CrewModal';
import { CrewDeleteDialog } from './components/crew/CrewDeleteDialog';
import { PortRoutesMap } from './components/ports/PortRoutesMap';

import {
  subscribeVessels,
  addVessel,
  updateVessel,
  deleteVessel,
  subscribeVoyages,
  addVoyage,
  updateVoyage,
  deleteVoyage,
  subscribeCargo,
  addCargo,
  updateCargo,
  deleteCargo,
  subscribeCrew,
  addCrewMember,
  updateCrewMember,
  deleteCrewMember,
} from './firebase/services';
import { checkAndSeedInitialData } from './firebase/seed';
import { testConnection } from './firebase/config';
import type { Vessel, Voyage, Cargo, CrewMember } from './types/shipping';
import { Ship } from 'lucide-react';

function ShippingManagementApp() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Firestore Data State
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [crewList, setCrewList] = useState<CrewMember[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(true);

  // Vessel Modals
  const [isVesselModalOpen, setIsVesselModalOpen] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [deletingVessel, setDeletingVessel] = useState<Vessel | null>(null);

  // Voyage Modals
  const [isVoyageModalOpen, setIsVoyageModalOpen] = useState(false);
  const [editingVoyage, setEditingVoyage] = useState<Voyage | null>(null);
  const [deletingVoyage, setDeletingVoyage] = useState<Voyage | null>(null);

  // Cargo Modals
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [deletingCargo, setDeletingCargo] = useState<Cargo | null>(null);

  // Crew Modals
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const [editingCrew, setEditingCrew] = useState<CrewMember | null>(null);
  const [deletingCrew, setDeletingCrew] = useState<CrewMember | null>(null);

  // Initial connection test & live Firestore subscriptions
  useEffect(() => {
    testConnection();

    // Attach real-time Firestore listeners
    const unsubVessels = subscribeVessels(
      (data) => {
        setVessels(data);
        setIsLoadingData(false);
      },
      (err) => console.error('Vessels sync error:', err)
    );

    const unsubVoyages = subscribeVoyages(
      (data) => setVoyages(data),
      (err) => console.error('Voyages sync error:', err)
    );

    const unsubCargo = subscribeCargo(
      (data) => setCargoList(data),
      (err) => console.error('Cargo sync error:', err)
    );

    const unsubCrew = subscribeCrew(
      (data) => setCrewList(data),
      (err) => console.error('Crew sync error:', err)
    );

    // Initial check for seed data
    checkAndSeedInitialData().catch(console.error);

    return () => {
      unsubVessels();
      unsubVoyages();
      unsubCargo();
      unsubCrew();
    };
  }, []);

  // If user is not logged in, render LoginForm as default view!
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-lg shadow-cyan-600/30 animate-bounce mb-4">
          <Ship className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-800">Menghubungkan ke Nusantara MarineFlow...</p>
        <p className="text-xs text-slate-500 mt-1">Mengakses Firebase Cloud Firestore</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // ==================== VESSEL CRUD ACTIONS ====================

  const handleOpenAddVessel = () => {
    setEditingVessel(null);
    setIsVesselModalOpen(true);
  };

  const handleOpenEditVessel = (vessel: Vessel) => {
    setEditingVessel(vessel);
    setIsVesselModalOpen(true);
  };

  const handleSaveVessel = async (vesselData: Omit<Vessel, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingVessel) {
        await updateVessel(editingVessel.id, vesselData);
        showToast('success', 'Kapal Diperbarui', `Data armada ${vesselData.name} berhasil disimpan di Firestore.`);
      } else {
        await addVessel(vesselData);
        showToast('success', 'Kapal Didaftarkan', `Kapal baru ${vesselData.name} (${vesselData.imoNumber}) telah ditambahkan ke Firestore.`);
      }
    } catch (err: any) {
      showToast('error', 'Gagal Menyimpan Kapal', err.message);
      throw err;
    }
  };

  const handleConfirmDeleteVessel = async () => {
    if (!deletingVessel) return;
    try {
      await deleteVessel(deletingVessel.id);
      showToast('success', 'Kapal Dihapus', `Data kapal ${deletingVessel.name} telah dihapus dari database.`);
      setDeletingVessel(null);
    } catch (err: any) {
      showToast('error', 'Gagal Menghapus Kapal', err.message);
      throw err;
    }
  };

  // ==================== VOYAGE CRUD ACTIONS ====================

  const handleOpenAddVoyage = () => {
    setEditingVoyage(null);
    setIsVoyageModalOpen(true);
  };

  const handleOpenEditVoyage = (voyage: Voyage) => {
    setEditingVoyage(voyage);
    setIsVoyageModalOpen(true);
  };

  const handleSaveVoyage = async (voyageData: Omit<Voyage, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingVoyage) {
        await updateVoyage(editingVoyage.id, voyageData);
        showToast('success', 'Jadwal Diperbarui', `Rute ${voyageData.voyageNumber} (${voyageData.originPort} → ${voyageData.destinationPort}) berhasil diupdate.`);
      } else {
        await addVoyage(voyageData);
        showToast('success', 'Pelayaran Dijadwalkan', `Jadwal baru ${voyageData.voyageNumber} untuk kapal ${voyageData.vesselName} berhasil dicatat.`);
      }
    } catch (err: any) {
      showToast('error', 'Gagal Menyimpan Jadwal', err.message);
      throw err;
    }
  };

  const handleConfirmDeleteVoyage = async () => {
    if (!deletingVoyage) return;
    try {
      await deleteVoyage(deletingVoyage.id);
      showToast('success', 'Jadwal Dihapus', `Jadwal pelayaran ${deletingVoyage.voyageNumber} telah dihapus.`);
      setDeletingVoyage(null);
    } catch (err: any) {
      showToast('error', 'Gagal Menghapus Jadwal', err.message);
      throw err;
    }
  };

  // ==================== CARGO CRUD ACTIONS ====================

  const handleOpenAddCargo = () => {
    setEditingCargo(null);
    setIsCargoModalOpen(true);
  };

  const handleOpenEditCargo = (cargo: Cargo) => {
    setEditingCargo(cargo);
    setIsCargoModalOpen(true);
  };

  const handleSaveCargo = async (cargoData: Omit<Cargo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingCargo) {
        await updateCargo(editingCargo.id, cargoData);
        showToast('success', 'Manifest Diperbarui', `Bill of Lading ${cargoData.billOfLading} berhasil diupdate.`);
      } else {
        await addCargo(cargoData);
        showToast('success', 'Bill of Lading Terbit', `Muatan ${cargoData.billOfLading} (${cargoData.weightTons} Ton) dicatat di database.`);
      }
    } catch (err: any) {
      showToast('error', 'Gagal Menyimpan Manifest', err.message);
      throw err;
    }
  };

  const handleConfirmDeleteCargo = async () => {
    if (!deletingCargo) return;
    try {
      await deleteCargo(deletingCargo.id);
      showToast('success', 'Manifest Dibatalkan', `Bill of Lading ${deletingCargo.billOfLading} telah dihapus.`);
      setDeletingCargo(null);
    } catch (err: any) {
      showToast('error', 'Gagal Menghapus Manifest', err.message);
      throw err;
    }
  };

  // ==================== CREW CRUD ACTIONS ====================

  const handleOpenAddCrew = () => {
    setEditingCrew(null);
    setIsCrewModalOpen(true);
  };

  const handleOpenEditCrew = (crew: CrewMember) => {
    setEditingCrew(crew);
    setIsCrewModalOpen(true);
  };

  const handleSaveCrew = async (crewData: Omit<CrewMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingCrew) {
        await updateCrewMember(editingCrew.id, crewData);
        showToast('success', 'Data Kru Diperbarui', `Profil pelaut ${crewData.fullName} berhasil diperbarui.`);
      } else {
        await addCrewMember(crewData);
        showToast('success', 'Kru Didaftarkan', `Pelaut ${crewData.fullName} (${crewData.rank}) berhasil didaftarkan.`);
      }
    } catch (err: any) {
      showToast('error', 'Gagal Menyimpan Kru', err.message);
      throw err;
    }
  };

  const handleConfirmDeleteCrew = async () => {
    if (!deletingCrew) return;
    try {
      await deleteCrewMember(deletingCrew.id);
      showToast('success', 'Kru Dihapus', `Data awak kapal ${deletingCrew.fullName} telah dihapus.`);
      setDeletingCrew(null);
    } catch (err: any) {
      showToast('error', 'Gagal Menghapus Kru', err.message);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar onRefreshData={() => checkAndSeedInitialData()} />

      {/* Tabs Bar */}
      <AppTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        counts={{
          vessels: vessels.length,
          voyages: voyages.length,
          cargo: cargoList.length,
          crew: crewList.length,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewDashboard
            vessels={vessels}
            voyages={voyages}
            cargoList={cargoList}
            crewList={crewList}
            onNavigateTab={setActiveTab}
            onAddVessel={handleOpenAddVessel}
            onAddVoyage={handleOpenAddVoyage}
            onAddCargo={handleOpenAddCargo}
            onAddCrew={handleOpenAddCrew}
          />
        )}

        {activeTab === 'vessels' && (
          <VesselList
            vessels={vessels}
            isLoading={isLoadingData}
            onAdd={handleOpenAddVessel}
            onEdit={handleOpenEditVessel}
            onDelete={(v) => setDeletingVessel(v)}
          />
        )}

        {activeTab === 'voyages' && (
          <VoyageList
            voyages={voyages}
            isLoading={isLoadingData}
            onAdd={handleOpenAddVoyage}
            onEdit={handleOpenEditVoyage}
            onDelete={(v) => setDeletingVoyage(v)}
          />
        )}

        {activeTab === 'cargo' && (
          <CargoList
            cargoList={cargoList}
            isLoading={isLoadingData}
            onAdd={handleOpenAddCargo}
            onEdit={handleOpenEditCargo}
            onDelete={(c) => setDeletingCargo(c)}
          />
        )}

        {activeTab === 'crew' && (
          <CrewList
            crewList={crewList}
            isLoading={isLoadingData}
            onAdd={handleOpenAddCrew}
            onEdit={handleOpenEditCrew}
            onDelete={(c) => setDeletingCrew(c)}
          />
        )}

        {activeTab === 'routes' && (
          <PortRoutesMap
            vessels={vessels}
            voyages={voyages}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Nusantara MarineFlow • PT Samudera Maritim Logistik Indonesia</p>
          <p className="text-[11px] text-slate-400">
            Terhubung ke Google Cloud Firestore (Live Real-time Single Source of Truth)
          </p>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <VesselModal
        isOpen={isVesselModalOpen}
        onClose={() => setIsVesselModalOpen(false)}
        onSave={handleSaveVessel}
        initialData={editingVessel}
      />
      <VesselDeleteDialog
        isOpen={!!deletingVessel}
        vessel={deletingVessel}
        onClose={() => setDeletingVessel(null)}
        onConfirm={handleConfirmDeleteVessel}
      />

      <VoyageModal
        isOpen={isVoyageModalOpen}
        onClose={() => setIsVoyageModalOpen(false)}
        onSave={handleSaveVoyage}
        initialData={editingVoyage}
        vessels={vessels}
      />
      <VoyageDeleteDialog
        isOpen={!!deletingVoyage}
        voyage={deletingVoyage}
        onClose={() => setDeletingVoyage(null)}
        onConfirm={handleConfirmDeleteVoyage}
      />

      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => setIsCargoModalOpen(false)}
        onSave={handleSaveCargo}
        initialData={editingCargo}
        voyages={voyages}
        vessels={vessels}
      />
      <CargoDeleteDialog
        isOpen={!!deletingCargo}
        cargo={deletingCargo}
        onClose={() => setDeletingCargo(null)}
        onConfirm={handleConfirmDeleteCargo}
      />

      <CrewModal
        isOpen={isCrewModalOpen}
        onClose={() => setIsCrewModalOpen(false)}
        onSave={handleSaveCrew}
        initialData={editingCrew}
        vessels={vessels}
      />
      <CrewDeleteDialog
        isOpen={!!deletingCrew}
        crew={deletingCrew}
        onClose={() => setDeletingCrew(null)}
        onConfirm={handleConfirmDeleteCrew}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ShippingManagementApp />
      </ToastProvider>
    </AuthProvider>
  );
}
