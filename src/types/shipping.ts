export type VesselType = 'Container' | 'Bulk Carrier' | 'Tanker' | 'Ro-Ro' | 'General Cargo';
export type VesselStatus = 'Sailing' | 'Berthed' | 'Anchored' | 'Maintenance';

export interface Vessel {
  id: string;
  name: string;
  imoNumber: string;
  type: VesselType;
  capacityDwt: number;
  capacityTeu?: number;
  status: VesselStatus;
  flag: string;
  yearBuilt: number;
  currentPort: string;
  destinationPort?: string;
  speedKnots: number;
  fuelConsumptionTonsPerDay: number;
  createdAt: string;
  updatedAt: string;
}

export type VoyageStatus = 'Scheduled' | 'In Transit' | 'Arrived' | 'Completed' | 'Delayed';

export interface Voyage {
  id: string;
  voyageNumber: string;
  vesselId: string;
  vesselName: string;
  originPort: string;
  destinationPort: string;
  departureDate: string; // ISO string / date
  arrivalDate: string;   // ISO string / date
  distanceNm: number;
  status: VoyageStatus;
  cargoTonnes: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CargoType = 'Dry Container' | 'Reefer Container' | 'Liquid Bulk' | 'Dry Bulk' | 'General Cargo' | 'Heavy Equipment';
export type CargoStatus = 'Pending Loading' | 'Loaded' | 'In Transit' | 'Discharged' | 'Delivered';

export interface Cargo {
  id: string;
  billOfLading: string;
  voyageNumber: string;
  vesselName: string;
  shipper: string;
  consignee: string;
  cargoType: CargoType;
  quantity: number;
  weightTons: number;
  volumeCbm?: number;
  status: CargoStatus;
  hazardous: boolean;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export type CrewRank = 
  | 'Nakhoda (Master)' 
  | 'Mualim I (Chief Officer)' 
  | 'Mualim II' 
  | 'Kepala Kamar Mesin (Chief Engineer)' 
  | 'Masinis II' 
  | 'Bosun' 
  | 'Juru Mudi (AB)' 
  | 'Oiler';

export type CrewStatus = 'On Duty' | 'On Leave' | 'Standby';

export interface CrewMember {
  id: string;
  fullName: string;
  seamanBookNo: string;
  rank: CrewRank;
  assignedVessel: string;
  status: CrewStatus;
  certificateExpiry: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'Super Admin' | 'Fleet Manager' | 'Cargo & Logistics Officer' | 'Operations Specialist';
  avatar?: string;
  isDemo?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
