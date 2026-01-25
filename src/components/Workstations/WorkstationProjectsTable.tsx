import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Meta4ERPTable, type TableColumn } from '../ui/Meta4ERPTable';
import type { Project } from '../../store/projectStore';

interface WorkstationProjectsTableProps {
  data: Project[];
}

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

  return (
    <Box>
      <Meta4ERPTable
        data={data}
        columns={getColumns(navigate)}
        showCheckboxes={false}
      />
    </Box>
  );
};
