import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './services';
import type { Vessel, Voyage, Cargo, CrewMember } from '../types/shipping';

export async function checkAndSeedInitialData(): Promise<{ seeded: boolean; counts: Record<string, number> }> {
  try {
    const vesselsSnap = await getDocs(collection(db, COLLECTIONS.VESSELS));
    
    // If vessels already exist, no need to auto-seed
    if (!vesselsSnap.empty) {
      return {
        seeded: false,
        counts: {
          vessels: vesselsSnap.size,
        },
      };
    }

    console.log('Seeding initial maritime fleet data to Firestore...');

    // 1. Initial Vessels
    const sampleVessels: Omit<Vessel, 'id'>[] = [
      {
        name: 'MV Nusantara Perdana',
        imoNumber: 'IMO9482103',
        type: 'Container',
        capacityDwt: 35000,
        capacityTeu: 2800,
        status: 'Sailing',
        flag: 'Indonesia',
        yearBuilt: 2019,
        currentPort: 'Tanjung Priok, Jakarta',
        destinationPort: 'Tanjung Perak, Surabaya',
        speedKnots: 18.5,
        fuelConsumptionTonsPerDay: 28,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'KM Baruna Samudera',
        imoNumber: 'IMO9324567',
        type: 'Bulk Carrier',
        capacityDwt: 52000,
        status: 'Berthed',
        flag: 'Indonesia',
        yearBuilt: 2016,
        currentPort: 'Tanjung Perak, Surabaya',
        destinationPort: 'Belawan, Medan',
        speedKnots: 14.0,
        fuelConsumptionTonsPerDay: 24,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'MT Celebes Energy',
        imoNumber: 'IMO9510982',
        type: 'Tanker',
        capacityDwt: 28000,
        status: 'Sailing',
        flag: 'Indonesia',
        yearBuilt: 2021,
        currentPort: 'Semayang, Balikpapan',
        destinationPort: 'Soekarno-Hatta, Makassar',
        speedKnots: 15.2,
        fuelConsumptionTonsPerDay: 22,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'KM Jayakarta Express',
        imoNumber: 'IMO9238411',
        type: 'Ro-Ro',
        capacityDwt: 12000,
        status: 'Berthed',
        flag: 'Indonesia',
        yearBuilt: 2017,
        currentPort: 'Batam Port, Batam',
        destinationPort: 'Tanjung Priok, Jakarta',
        speedKnots: 17.0,
        fuelConsumptionTonsPerDay: 19,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'MV Papua Star',
        imoNumber: 'IMO9617234',
        type: 'General Cargo',
        capacityDwt: 18500,
        status: 'Anchored',
        flag: 'Indonesia',
        yearBuilt: 2018,
        currentPort: 'Pelabuhan Sorong, Papua Barat',
        destinationPort: 'Tanjung Perak, Surabaya',
        speedKnots: 13.5,
        fuelConsumptionTonsPerDay: 16,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'KM Seram Pioneer',
        imoNumber: 'IMO9456712',
        type: 'Container',
        capacityDwt: 22000,
        capacityTeu: 1400,
        status: 'Maintenance',
        flag: 'Indonesia',
        yearBuilt: 2014,
        currentPort: 'Galangan Dok Tanjung Uncang, Batam',
        destinationPort: 'Siap Docking',
        speedKnots: 0,
        fuelConsumptionTonsPerDay: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const v of sampleVessels) {
      await addDoc(collection(db, COLLECTIONS.VESSELS), v);
    }

    // 2. Initial Voyages
    const sampleVoyages: Omit<Voyage, 'id'>[] = [
      {
        voyageNumber: 'VYG-2026-JKT-SBY-042',
        vesselId: 'auto',
        vesselName: 'MV Nusantara Perdana',
        originPort: 'Tanjung Priok (Jakarta)',
        destinationPort: 'Tanjung Perak (Surabaya)',
        departureDate: '2026-10-02T08:00',
        arrivalDate: '2026-10-03T18:00',
        distanceNm: 410,
        status: 'In Transit',
        cargoTonnes: 18500,
        notes: 'Jalur Alur Laut Kepulauan Indonesia (ALKI) I aman, cuaca laut Jawa gelombang 1.2m',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        voyageNumber: 'VYG-2026-SBY-MKS-019',
        vesselId: 'auto',
        vesselName: 'KM Baruna Samudera',
        originPort: 'Tanjung Perak (Surabaya)',
        destinationPort: 'Soekarno-Hatta (Makassar)',
        departureDate: '2026-10-04T10:00',
        arrivalDate: '2026-10-06T06:00',
        distanceNm: 490,
        status: 'Scheduled',
        cargoTonnes: 45000,
        notes: 'Muatan curah semen kantong & baja kargo industri',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        voyageNumber: 'VYG-2026-BPN-MKS-077',
        vesselId: 'auto',
        vesselName: 'MT Celebes Energy',
        originPort: 'Semayang (Balikpapan)',
        destinationPort: 'Soekarno-Hatta (Makassar)',
        departureDate: '2026-10-01T14:00',
        arrivalDate: '2026-10-02T22:00',
        distanceNm: 310,
        status: 'In Transit',
        cargoTonnes: 24000,
        notes: 'BBM Solar Industri & Marine Gas Oil kargo B2B Pertamina',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        voyageNumber: 'VYG-2026-JKT-BLW-088',
        vesselId: 'auto',
        vesselName: 'KM Jayakarta Express',
        originPort: 'Tanjung Priok (Jakarta)',
        destinationPort: 'Belawan (Medan)',
        departureDate: '2026-10-06T15:00',
        arrivalDate: '2026-10-09T08:00',
        distanceNm: 820,
        status: 'Scheduled',
        cargoTonnes: 9800,
        notes: 'Muatan Ro-Ro logistik kendaraan niaga dan FMCG lintas Sumatera',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const voy of sampleVoyages) {
      await addDoc(collection(db, COLLECTIONS.VOYAGES), voy);
    }

    // 3. Initial Cargo
    const sampleCargo: Omit<Cargo, 'id'>[] = [
      {
        billOfLading: 'BL-JKT-SBY-88219',
        voyageNumber: 'VYG-2026-JKT-SBY-042',
        vesselName: 'MV Nusantara Perdana',
        shipper: 'PT Indofood CBP Sukses Makmur Tbk',
        consignee: 'PT Sumber Alfaria Trijaya Regional Jatim',
        cargoType: 'Dry Container',
        quantity: 85,
        weightTons: 1420,
        volumeCbm: 2400,
        status: 'In Transit',
        hazardous: false,
        specialInstructions: 'Jaga kelembapan kontainer di bawah 65%',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        billOfLading: 'BL-BPN-MKS-10943',
        voyageNumber: 'VYG-2026-BPN-MKS-077',
        vesselName: 'MT Celebes Energy',
        shipper: 'PT Pertamina Patra Niaga Kilang Balikpapan',
        consignee: 'PT Bosowa Corporindo Logistics Hub',
        cargoType: 'Liquid Bulk',
        quantity: 4,
        weightTons: 4800,
        volumeCbm: 5600,
        status: 'In Transit',
        hazardous: true,
        specialInstructions: 'Flash point > 60°C. Dangerous Cargo Class 3 Flammable Liquid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        billOfLading: 'BL-SBY-MKS-44910',
        voyageNumber: 'VYG-2026-SBY-MKS-019',
        vesselName: 'KM Baruna Samudera',
        shipper: 'PT Semen Indonesia (Persero) Tbk',
        consignee: 'PT Makassar Konstruksi Maritim',
        cargoType: 'Dry Bulk',
        quantity: 1200,
        weightTons: 3600,
        volumeCbm: 2900,
        status: 'Pending Loading',
        hazardous: false,
        specialInstructions: 'Simpan di palka kedap air No. 2 dan 3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        billOfLading: 'BL-SRG-JKT-22019',
        voyageNumber: 'VYG-2026-JKT-SBY-042',
        vesselName: 'MV Papua Star',
        shipper: 'PT Pasifik Seafood Maluku Papua',
        consignee: 'PT Central Cold Storage Indonesia',
        cargoType: 'Reefer Container',
        quantity: 24,
        weightTons: 580,
        volumeCbm: 960,
        status: 'Loaded',
        hazardous: false,
        specialInstructions: 'Reefer genset aktif temperatur wajib stabil -22°C',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const c of sampleCargo) {
      await addDoc(collection(db, COLLECTIONS.CARGO), c);
    }

    // 4. Initial Crew Members
    const sampleCrew: Omit<CrewMember, 'id'>[] = [
      {
        fullName: 'Capt. Haryanto Santoso, M.Mar',
        seamanBookNo: 'B.049182/IDN/2021',
        rank: 'Nakhoda (Master)',
        assignedVessel: 'MV Nusantara Perdana',
        status: 'On Duty',
        certificateExpiry: '2028-05-15',
        contactPhone: '+62 811-9876-5432',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        fullName: 'Ir. Bambang Irawan, C.Eng',
        seamanBookNo: 'B.038192/IDN/2020',
        rank: 'Kepala Kamar Mesin (Chief Engineer)',
        assignedVessel: 'KM Baruna Samudera',
        status: 'On Duty',
        certificateExpiry: '2027-11-20',
        contactPhone: '+62 812-3344-5566',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        fullName: 'Denny Prasetyo, ANT-II',
        seamanBookNo: 'B.077219/IDN/2022',
        rank: 'Mualim I (Chief Officer)',
        assignedVessel: 'MV Nusantara Perdana',
        status: 'On Duty',
        certificateExpiry: '2029-01-10',
        contactPhone: '+62 813-9087-6541',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        fullName: 'Ahmad Fauzi, ATT-III',
        seamanBookNo: 'B.099120/IDN/2023',
        rank: 'Masinis II',
        assignedVessel: 'MT Celebes Energy',
        status: 'On Duty',
        certificateExpiry: '2028-08-30',
        contactPhone: '+62 815-7766-4433',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        fullName: 'Slamet Riyadi',
        seamanBookNo: 'B.066431/IDN/2021',
        rank: 'Bosun',
        assignedVessel: 'KM Jayakarta Express',
        status: 'On Leave',
        certificateExpiry: '2027-04-12',
        contactPhone: '+62 821-4455-6677',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        fullName: 'Wahyu Nugroho',
        seamanBookNo: 'B.102381/IDN/2024',
        rank: 'Juru Mudi (AB)',
        assignedVessel: 'MV Papua Star',
        status: 'On Duty',
        certificateExpiry: '2029-09-18',
        contactPhone: '+62 856-1122-3344',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const cr of sampleCrew) {
      await addDoc(collection(db, COLLECTIONS.CREW), cr);
    }

    return {
      seeded: true,
      counts: {
        vessels: sampleVessels.length,
        voyages: sampleVoyages.length,
        cargo: sampleCargo.length,
        crew: sampleCrew.length,
      },
    };
  } catch (error) {
    console.error('Error seeding initial Firestore data:', error);
    return { seeded: false, counts: {} };
  }
}
