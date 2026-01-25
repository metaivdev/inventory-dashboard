import { Box, Flex, Grid, Image, Text } from '@chakra-ui/react';
import statusIcon from '../../assets/icons/status.svg';
import reportIcon from '../../assets/icons/report.svg';
import tagIcon from '../../assets/icons/tag.svg';
import calendarIcon from '../../assets/icons/calendar.svg';
import projectsIcon from '../../assets/icons/projects.svg';
import { Tabs } from './Tabs';
import { useProjectStore } from '../../store';

interface ProjectOverviewProps {
  projectId?: string;
}

export const ProjectOverview = ({ projectId }: ProjectOverviewProps) => {
  const { getProjectById } = useProjectStore();
  const project = projectId ? getProjectById(projectId) : null;

  if (!project) {
    return (
      <Box bg="#FFFFFF" minH="100vh" p={5}>
        <Text color="black" fontSize="22px" fontWeight={500}>
          Project not found
        </Text>
      </Box>
    );
  }

  const statusColors: Record<string, string> = {
    Active: '#1447E6',
    'In Progress': '#F59E0B',
    Completed: '#111723',
    'On Hold': '#EF4444',
  };

  return (
    <Box bg="#FFFFFF" minH="100vh" p={5}>
      <Flex gap={3}>
        <Box>
          <Text color="black" fontSize="22px" fontWeight={500}>
            {project.name}
          </Text>
          <Text color="#4A5565">
            {project.currentStage || '1st stage of production'}
          </Text>
        </Box>

        <Box
          bg={`${statusColors[project.status] || '#1447E6'}20`}
          py={1}
          px={3}
          borderRadius="8px"
          h="fit-content"
          w="fit-content"
        >
          <Text color={statusColors[project.status] || '#1447E6'}>
            {project.status}
          </Text>
        </Box>
      </Flex>

      <Box
        mt={5}
        border="1px solid #E5E5E5"
        borderRadius="2px"
        p={5}
        color="#4A5565"
      >
        <Grid templateColumns="1fr 1fr" maxW="40%" gapY={3}>
          <Box>
            <Flex gap={2}>
              <Image src={reportIcon} alt="status" />
              <Text>Status</Text>
            </Flex>
          </Box>
          <Box>
            <Flex gap={2}>
              <Image src={statusIcon} alt="status" />
              <Text>{project.status}</Text>
            </Flex>
          </Box>
          <Box>
            <Flex alignItems="center" gap={2}>
              <Image src={tagIcon} alt="status" />
              <Text>Line operator</Text>
            </Flex>
          </Box>
          <Box>
            <Text>{project.lineOperator || 'N/A'}</Text>
          </Box>
          <Box>
            <Flex alignItems="center" gap={2}>
              <Image src={projectsIcon} alt="quantity" />
              <Text>Quantity</Text>
            </Flex>
          </Box>
          <Box>
            <Flex alignItems="center" gap={2}>
              <Image src={projectsIcon} alt="status" />
              <Text>{project.quantity} units</Text>
            </Flex>
          </Box>
          <Box>
            <Flex alignItems="center" gap={2}>
              <Image src={reportIcon} alt="status" />
              <Text>Created date</Text>
            </Flex>
          </Box>
          <Box>
            <Flex alignItems="center" gap={2}>
              <Image src={calendarIcon} alt="status" />
              <Text>{project.createdDate || project.dateStarted}</Text>
            </Flex>
          </Box>
          <Box>
            <Flex alignItems="center" gap={2}>
              <Image src={reportIcon} alt="status" />
              <Text>Confirmation date</Text>
            </Flex>
          </Box>
          <Box>
            <Flex alignItems="center" gap={2}>
              <Image src={calendarIcon} alt="status" />
              <Text>{project.confirmationDate || project.dateStarted}</Text>
            </Flex>
          </Box>
        </Grid>
      </Box>

      <Box color="black" mt={10}>
        <Tabs />
      </Box>
    </Box>
  );
};
