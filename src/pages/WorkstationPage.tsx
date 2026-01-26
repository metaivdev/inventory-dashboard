import { useState, useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useWorkstationStore } from '../store/workstationStore';
import { useProjectStore } from '../store/projectStore';
import { WorkstationProjectsTable } from '../components/Workstations/WorkstationProjectsTable';
import searchIcon from '../assets/icons/search.svg';
import { Meta4ERPInputField } from '../components/ui/Meta4ERPInputField';

const tabs = ['All', 'Pending', 'Completed', 'On Hold'];

export const WorkstationPage = () => {
  const { workstationId } = useParams<{ workstationId: string }>();
  const { workstations } = useWorkstationStore();
  const { projects } = useProjectStore();
  const [activeTab, setActiveTab] = useState('All');

  const workstation = workstations.find((ws) => ws.id === workstationId);

  // Filter projects that have this workstation
  // Match by checking if workstation name (without "Station") matches project workstation name
  const workstationNameWithoutStation = workstation?.name.replace(
    ' Station',
    ''
  ) || '';

  const allWorkstationProjects = useMemo(
    () =>
      workstation
        ? projects.filter((project) =>
            project.workstations.some(
              (ws) =>
                ws.name === workstation.name ||
                ws.name === workstationNameWithoutStation ||
                workstation.name.includes(ws.name)
            )
          )
        : [],
    [projects, workstation, workstationNameWithoutStation]
  );

  // Filter projects by active tab status
  const workstationProjects = useMemo(() => {
    if (activeTab === 'All') {
      return allWorkstationProjects;
    }
    if (activeTab === 'Pending') {
      return allWorkstationProjects.filter(
        (p) => p.status === 'In Progress'
      );
    }
    if (activeTab === 'Completed') {
      return allWorkstationProjects.filter((p) => p.status === 'Completed');
    }
    if (activeTab === 'On Hold') {
      return allWorkstationProjects.filter((p) => p.status === 'On Hold');
    }
    return allWorkstationProjects;
  }, [allWorkstationProjects, activeTab]);

  const getSearchPlaceholder = () => {
    const tabText = activeTab === 'All' ? 'all' : activeTab.toLowerCase();
    return `Search ${tabText} projects`;
  };

  if (!workstation) {
    return (
      <Box p={5} bg="white" minH="100vh">
        <Text fontSize="22px" fontWeight={500} color="#111723">
          Workstation not found
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="white" minH="100vh">
      <Box>
        <Flex
          bg="#F8F8F8"
          w="100%"
          color="#111723"
          borderTop="1px solid #D1D5DC"
          borderLeft="1px solid #D1D5DC"
          borderRight="1px solid #D1D5DC"
        >
          {tabs.map((tab, index) => (
            <Box
              key={tab}
              py={3}
              px={8}
              borderRight={index < tabs.length - 1 ? '1px solid #D1D5DC' : 'none'}
              borderBottom={activeTab === tab ? 'none' : '1px solid #D1D5DC'}
              bg={activeTab === tab ? 'white' : '#F8F8F8'}
              cursor="pointer"
              onClick={() => setActiveTab(tab)}
              _hover={{ bg: activeTab === tab ? 'white' : '#F0F0F0' }}
            >
              <Text fontWeight={400}>{tab}</Text>
            </Box>
          ))}
        </Flex>
      </Box>

      <Box
        bg="white"
        w="100%"
        borderRight="1px solid #D1D5DC"
        borderLeft="1px solid #D1D5DC"
        borderBottom="1px solid #D1D5DC"
        p={5}
      >
        <Box mb={6}>
          <Text color="#4A5565" mb={2}>
            Search {activeTab === 'All' ? 'all' : activeTab.toLowerCase()} projects
          </Text>
          <Meta4ERPInputField
            icon={searchIcon}
            type="text"
            width="340px"
            placeholder={getSearchPlaceholder()}
          />
        </Box>

        {workstationProjects.length > 0 ? (
          <WorkstationProjectsTable data={workstationProjects} />
        ) : (
          <Box mt={8}>
            <Text color="#4A5565">
              No {activeTab === 'All' ? '' : activeTab.toLowerCase()}{' '}
              projects found for this workstation.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
