import { Box } from '@chakra-ui/react';
import { Workstations } from '../components/Workstations';

export const WorkstationsPage = () => {
  return (
    <Box p={5} bg="white" minH="100vh">
      <Workstations />
    </Box>
  );
};
