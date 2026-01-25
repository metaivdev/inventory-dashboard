import { Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useWorkstationStore } from '../store/workstationStore';
import { useProjectStore } from '../store/projectStore';
import { WorkstationProjectsTable } from '../components/Workstations/WorkstationProjectsTable';

export const WorkstationPage = () => {
  const { workstationId } = useParams<{ workstationId: string }>();
  const { workstations } = useWorkstationStore();
  const { projects } = useProjectStore();

  const workstation = workstations.find((ws) => ws.id === workstationId);

  if (!workstation) {
    return (
      <Box p={5} bg="white" minH="100vh">
        <Text fontSize="22px" fontWeight={500} color="#111723">
          Workstation not found
        </Text>
      </Box>
    );
  }

  // Filter projects that have this workstation
  // Match by checking if workstation name (without "Station") matches project workstation name
  const workstationNameWithoutStation = workstation.name.replace(' Station', '');
  const workstationProjects = projects.filter((project) =>
    project.workstations.some(
      (ws) =>
        ws.name === workstation.name ||
        ws.name === workstationNameWithoutStation ||
        workstation.name.includes(ws.name)
    )
  );

  return (
    <Box p={5} bg="white" minH="100vh">
      <Text fontSize="22px" fontWeight={500} color="#111723" mb={2}>
        {workstation.name}
      </Text>
      <Text color="#4A5565" mb={6}>
        Projects assigned to this workstation
      </Text>

      {workstationProjects.length > 0 ? (
        <WorkstationProjectsTable data={workstationProjects} />
      ) : (
        <Box mt={8}>
          <Text color="#4A5565">No projects found for this workstation.</Text>
        </Box>
      )}
    </Box>
  );
};
