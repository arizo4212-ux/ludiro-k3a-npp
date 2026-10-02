import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errors';
import type { Vessel, Voyage, Cargo, CrewMember } from '../types/shipping';

// Collections paths
export const COLLECTIONS = {
  VESSELS: 'vessels',
  VOYAGES: 'voyages',
  CARGO: 'cargo',
  CREW: 'crew',
} as const;

// ======================== VESSELS ========================

export function subscribeVessels(
  onData: (vessels: Vessel[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = COLLECTIONS.VESSELS;
  const q = query(collection(db, path), orderBy('name', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Vessel[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Vessel, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function addVessel(vesselData: Omit<Vessel, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = COLLECTIONS.VESSELS;
  try {
    const docRef = await addDoc(collection(db, path), {
      ...vesselData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateVessel(id: string, vesselData: Partial<Vessel>): Promise<void> {
  const path = `${COLLECTIONS.VESSELS}/${id}`;
  try {
    const { id: _, ...rest } = vesselData;
    await updateDoc(doc(db, COLLECTIONS.VESSELS, id), {
      ...rest,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteVessel(id: string): Promise<void> {
  const path = `${COLLECTIONS.VESSELS}/${id}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.VESSELS, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================== VOYAGES ========================

export function subscribeVoyages(
  onData: (voyages: Voyage[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = COLLECTIONS.VOYAGES;
  const q = query(collection(db, path), orderBy('departureDate', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Voyage[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Voyage, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function addVoyage(voyageData: Omit<Voyage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = COLLECTIONS.VOYAGES;
  try {
    const docRef = await addDoc(collection(db, path), {
      ...voyageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateVoyage(id: string, voyageData: Partial<Voyage>): Promise<void> {
  const path = `${COLLECTIONS.VOYAGES}/${id}`;
  try {
    const { id: _, ...rest } = voyageData;
    await updateDoc(doc(db, COLLECTIONS.VOYAGES, id), {
      ...rest,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteVoyage(id: string): Promise<void> {
  const path = `${COLLECTIONS.VOYAGES}/${id}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.VOYAGES, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================== CARGO ========================

export function subscribeCargo(
  onData: (cargo: Cargo[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = COLLECTIONS.CARGO;
  const q = query(collection(db, path), orderBy('billOfLading', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Cargo[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Cargo, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function addCargo(cargoData: Omit<Cargo, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = COLLECTIONS.CARGO;
  try {
    const docRef = await addDoc(collection(db, path), {
      ...cargoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCargo(id: string, cargoData: Partial<Cargo>): Promise<void> {
  const path = `${COLLECTIONS.CARGO}/${id}`;
  try {
    const { id: _, ...rest } = cargoData;
    await updateDoc(doc(db, COLLECTIONS.CARGO, id), {
      ...rest,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCargo(id: string): Promise<void> {
  const path = `${COLLECTIONS.CARGO}/${id}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.CARGO, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ======================== CREW ========================

export function subscribeCrew(
  onData: (crew: CrewMember[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = COLLECTIONS.CREW;
  const q = query(collection(db, path), orderBy('fullName', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: CrewMember[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<CrewMember, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function addCrewMember(crewData: Omit<CrewMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = COLLECTIONS.CREW;
  try {
    const docRef = await addDoc(collection(db, path), {
      ...crewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCrewMember(id: string, crewData: Partial<CrewMember>): Promise<void> {
  const path = `${COLLECTIONS.CREW}/${id}`;
  try {
    const { id: _, ...rest } = crewData;
    await updateDoc(doc(db, COLLECTIONS.CREW, id), {
      ...rest,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCrewMember(id: string): Promise<void> {
  const path = `${COLLECTIONS.CREW}/${id}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.CREW, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
