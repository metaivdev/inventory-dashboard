import { create } from 'zustand';

export interface WorkstationData {
  id: string;
  name: string;
  status: 'Active' | 'Paused';
  activeProjects: number;
  pausedProjects: number;
  adminName: string;
  adminRole: string;
}

interface WorkstationStore {
  // State
  workstations: WorkstationData[];
}

// Hardcoded workstation data - will be replaced with API endpoints later
const initialWorkstations: WorkstationData[] = [
  {
    id: '1',
    name: 'Printing Station',
    status: 'Active',
    activeProjects: 5,
    pausedProjects: 2,
    adminName: 'Moyin Oyelohunnu',
    adminRole: 'Super Admin',
  },
  {
    id: '2',
    name: 'Assembly Station',
    status: 'Active',
    activeProjects: 8,
    pausedProjects: 1,
    adminName: 'John Doe',
    adminRole: 'Station Manager',
  },
  {
    id: '3',
    name: 'Welding Station',
    status: 'Active',
    activeProjects: 3,
    pausedProjects: 0,
    adminName: 'Jane Smith',
    adminRole: 'Super Admin',
  },
  {
    id: '4',
    name: 'Fabrication Station',
    status: 'Paused',
    activeProjects: 0,
    pausedProjects: 4,
    adminName: 'Mike Johnson',
    adminRole: 'Station Manager',
  },
  {
    id: '5',
    name: 'QC Station',
    status: 'Active',
    activeProjects: 6,
    pausedProjects: 1,
    adminName: 'Sarah Williams',
    adminRole: 'Super Admin',
  },
  {
    id: '6',
    name: 'Electrical Station',
    status: 'Active',
    activeProjects: 4,
    pausedProjects: 2,
    adminName: 'David Brown',
    adminRole: 'Station Manager',
  },
];

export const useWorkstationStore = create<WorkstationStore>(() => ({
  // Initial state
  workstations: initialWorkstations,
}));
