import { Box, Text, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { WorkstationData } from '../../store/workstationStore';

interface WorkstationProps {
  workstation: WorkstationData;
}

export const Workstation = ({ workstation }: WorkstationProps) => {
  const navigate = useNavigate();

  return (
    <Box
      border="3px solid #E4E7EC"
      borderRadius="2xl"
      px={6}
      py={4}
      maxW="250px"
      cursor="pointer"
      onClick={() => navigate(`/workstation/${workstation.id}`)}
      _hover={{ borderColor: '#1447E6', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <Text fontSize="14px" fontWeight={500} mb={2} color="#111723">
        {workstation.name}
      </Text>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="14px" color="#4A5565" mb={1}>
            Active Projects
          </Text>
          <Text fontSize="14px" color="#4A5565" mb={1}>
            In Progress Projects
          </Text>
          <Text fontSize="14px" color="#4A5565" mb={1}>
            Completed Projects
          </Text>
          <Text fontSize="14px" color="#4A5565" mb={1}>
            On Hold Projects
          </Text>
        </Box>
        <Box color="#4A5565" fontSize="14px">
          <Text mb={1}>145</Text>
          <Text mb={1}>145</Text>
          <Text mb={1}>145</Text>
          <Text mb={1}>145</Text>
        </Box>
      </Flex>

      <Box mt={3} pt={3} borderTop="1px solid #E5E5E5">
        <Text fontSize="14px" color="#111723" mb={1}>
          {workstation.adminRole}
        </Text>
        <Text color="#4A5565" fontSize="14px" fontWeight={500}>
          {workstation.adminName}
        </Text>
      </Box>
    </Box>
  );
};
