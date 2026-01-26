import { create } from 'zustand';

export interface Workstation {
  name: string;
  quantity: number;
}

export interface Project {
  id: string;
  name: string;
  idTag: string;
  quantity: number;
  dateStarted: string;
  workstations: Workstation[];
  status: 'Active' | 'In Progress' | 'Completed' | 'On Hold';
  // Additional fields for project overview
  lineOperator?: string;
  createdDate?: string;
  confirmationDate?: string;
  currentStage?: string;
}

interface ProjectStore {
  // State
  isNewProjectOpen: boolean;
  isTransferOrderOpen: boolean;
  projects: Project[];

  // Actions
  openNewProject: () => void;
  closeNewProject: () => void;
  openTransferOrder: () => void;
  closeTransferOrder: () => void;
  getProjectById: (id: string) => Project | undefined;
}

// Hardcoded project data - will be replaced with API endpoints later
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Wema Bank Job',
    idTag: 'PRJ-001',
    quantity: 150,
    dateStarted: '2025-01-10',
    workstations: [
      { name: 'Assembly', quantity: 12 },
      { name: 'Welding', quantity: 8 },
    ],
    status: 'Active',
    lineOperator: 'Marvellous Adesanya',
    createdDate: '12th January 2026',
    confirmationDate: '12th January 2026',
    currentStage: '1st stage of production',
  },
  {
    id: '2',
    name: 'Offshore Drilling Rig',
    idTag: 'PRJ-002',
    quantity: 75,
    dateStarted: '2025-01-05',
    workstations: [
      { name: 'Fabrication', quantity: 15 },
      { name: 'QC', quantity: 3 },
    ],
    status: 'In Progress',
    lineOperator: 'John Doe',
    createdDate: '5th January 2026',
    confirmationDate: '5th January 2026',
    currentStage: '2nd stage of production',
  },
  {
    id: '3',
    name: 'Solar Farm Installation',
    idTag: 'PRJ-003',
    quantity: 500,
    dateStarted: '2024-12-15',
    workstations: [
      { name: 'Electrical', quantity: 25 },
      { name: 'Assembly', quantity: 40 },
    ],
    status: 'Completed',
    lineOperator: 'Jane Smith',
    createdDate: '15th December 2025',
    confirmationDate: '15th December 2025',
    currentStage: 'Completed',
  },
  {
    id: '4',
    name: 'Highway Expansion',
    idTag: 'PRJ-004',
    quantity: 200,
    dateStarted: '2025-01-18',
    workstations: [
      { name: 'Concrete', quantity: 18 },
      { name: 'Paving', quantity: 22 },
    ],
    status: 'Active',
    lineOperator: 'Mike Johnson',
    createdDate: '18th January 2026',
    confirmationDate: '18th January 2026',
    currentStage: '1st stage of production',
  },
  {
    id: '5',
    name: 'Warehouse Automation',
    idTag: 'PRJ-005',
    quantity: 30,
    dateStarted: '2025-01-12',
    workstations: [
      { name: 'Robotics', quantity: 5 },
      { name: 'Software', quantity: 2 },
    ],
    status: 'On Hold',
    lineOperator: 'Sarah Williams',
    createdDate: '12th January 2026',
    confirmationDate: '12th January 2026',
    currentStage: 'On Hold',
  },
  {
    id: '6',
    name: 'Port Terminal Upgrade',
    idTag: 'PRJ-006',
    quantity: 120,
    dateStarted: '2024-11-20',
    workstations: [
      { name: 'Crane', quantity: 10 },
      { name: 'Logistics', quantity: 14 },
    ],
    status: 'Completed',
    lineOperator: 'David Brown',
    createdDate: '20th November 2025',
    confirmationDate: '20th November 2025',
    currentStage: 'Completed',
  },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  isNewProjectOpen: false,
  isTransferOrderOpen: false,
  projects: initialProjects,

  // Actions
  openNewProject: () => set({ isNewProjectOpen: true }),
  closeNewProject: () => set({ isNewProjectOpen: false }),
  openTransferOrder: () => set({ isTransferOrderOpen: true }),
  closeTransferOrder: () => set({ isTransferOrderOpen: false }),
  getProjectById: (id: string) => {
    return get().projects.find((project) => project.id === id);
  },
}));
