import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  Meta4ERPTable,
  type TableColumn,
  type TableAction,
} from '../ui/Meta4ERPTable';
import type { Project } from '../../store/projectStore';
import { useProjectStore } from '../../store';

interface WorkstationProjectsTableProps {
  data: Project[];
}

// 3-dots menu icon component
const ThreeDotsIcon = () => (
  <Box
    as="svg"
    width="20px"
    height="20px"
    fill="none"
    cursor="pointer"
    display="flex"
    alignItems="center"
    justifyContent="center"
    _hover={{ opacity: 0.7 }}
  >
    <circle cx="12" cy="5" r="2" fill="#4A5565" />
    <circle cx="12" cy="12" r="2" fill="#4A5565" />
    <circle cx="12" cy="19" r="2" fill="#4A5565" />
  </Box>
);

const getColumns = (
  navigate: (path: string) => void
): TableColumn<Project>[] => [
  {
    key: 'name',
    label: 'Project Name',
    render: (item) => (
      <Text
        cursor="pointer"
        color="#1447E6"
        _hover={{ textDecoration: 'underline' }}
        onClick={() => navigate(`/project/${item.id}`)}
      >
        {item.name}
      </Text>
    ),
  },
  { key: 'idTag', label: 'ID Tag' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'dateStarted', label: 'Date Started' },
  {
    key: 'status',
    label: 'Status',
    render: (item) => {
      const colors: Record<string, string> = {
        Active: '#1447E6',
        'In Progress': '#F59E0B',
        Completed: '#111723',
        'On Hold': '#EF4444',
      };
      return (
        <Box
          as="span"
          px={2}
          py={1}
          borderRadius="full"
          bg={`${colors[item.status]}20`}
          color={colors[item.status]}
          fontSize="sm"
        >
          {item.status}
        </Box>
      );
    },
  },
];

export const WorkstationProjectsTable = ({
  data,
}: WorkstationProjectsTableProps) => {
  const navigate = useNavigate();
  const { openTransferOrder } = useProjectStore();

  const handleSelectionChange = (selectedIds: string[]) => {
    console.log('Selected project IDs:', selectedIds);
  };

  const actions: TableAction<Project>[] = [
    {
      icon: <ThreeDotsIcon />,
      onClick: (item) => {
        console.log('Action clicked for project:', item);
        openTransferOrder();
      },
      tooltip: 'Transfer order',
    },
  ];

  return (
    <Box>
      <Meta4ERPTable
        data={data}
        columns={getColumns(navigate)}
        showCheckboxes={true}
        onSelectionChange={handleSelectionChange}
        actions={actions}
      />
    </Box>
  );
};
