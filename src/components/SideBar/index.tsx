import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Text, Image, Flex } from '@chakra-ui/react';
import meta4logo from '../../assets/4-logo.png';
import personnelIcon from '../../assets/icons/personnel.svg';
import settingsIcon from '../../assets/icons/settings.svg';
import { Meta4ERPInputField } from '../ui/Meta4ERPInputField';
import searchIcon from '../../assets/icons/search.svg';
import plusIcon from '../../assets/icons/plus.svg';
import minusIcon from '../../assets/icons/minus.svg';
import workStationIcon from '../../assets/icons/workspaces.svg';
import projectsIcon from '../../assets/icons/projects.svg';
import historyIcon from '../../assets/icons/history.svg';
import { useProjectStore } from '../../store';
import { useWorkstationStore } from '../../store/workstationStore';

export const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ projectId?: string; workstationId?: string }>();
  const { openNewProject, projects } = useProjectStore();
  const { workstations } = useWorkstationStore();

  // Derive active project and workstation from route params
  const activeProjectId = params.projectId || null;
  const activeWorkstationId = params.workstationId || null;

  // Derive dropdown states from route
  const isWorkstationsOpen =
    activeWorkstationId !== null || location.pathname === '/workstations';
  const isProjectsOpen =
    activeProjectId !== null || location.pathname === '/projects' || location.pathname === '/';

  const handleProjectClick = (projectId: string) => {
    if (activeProjectId === projectId) {
      navigate('/projects');
    } else {
      navigate(`/project/${projectId}`);
    }
  };

  const handleWorkstationClick = (workstationId: string) => {
    if (activeWorkstationId === workstationId) {
      navigate('/workstations');
    } else {
      navigate(`/workstation/${workstationId}`);
    }
  };

  const handleWorkstationsToggle = () => {
    if (activeWorkstationId) {
      navigate('/workstations');
    } else if (location.pathname === '/workstations') {
      // Already on workstations page, do nothing (dropdown stays open)
    } else {
      navigate('/workstations');
    }
  };

  const handleProjectsToggle = () => {
    if (activeProjectId) {
      navigate('/projects');
    } else if (location.pathname === '/projects' || location.pathname === '/') {
      // Already on projects page, do nothing (dropdown stays open)
    } else {
      navigate('/projects');
    }
  };

  return (
    <Box
      maxW="450px"
      bg="white"
      minH="100vh"
      px={3}
      color="#111723"
      borderRight="1px solid #D1D5DC"
    >
      <Flex gap={5} h="100%">
        <Box py={5} pr={3} spaceY={7} borderRight="1px solid #D1D5DC" h="100%">
          <Image src={meta4logo} alt="Meta4 Logo" />
          <Image src={personnelIcon} alt="Personnel Icon" />
          <Image src={settingsIcon} alt="Settings Icon" />
        </Box>

        <Box py={5}>
          <Text fontSize="22px" fontWeight={500}>
            ERP Management System
          </Text>

          <Meta4ERPInputField
            icon={searchIcon}
            type="text"
            placeholder="Search"
          />

          <Box mt={5} spaceY={7} fontWeight={500}>
            <Flex
              gap={3}
              alignItems="center"
              cursor="pointer"
              onClick={openNewProject}
              _hover={{ opacity: 0.7 }}
            >
              <Image src={plusIcon} alt="Plus Icon" />
              <Text>Create new</Text>
            </Flex>

            <Box>
              <Flex
                gap={3}
                alignItems="center"
                cursor="pointer"
                onClick={handleWorkstationsToggle}
                _hover={{ opacity: 0.7 }}
              >
                <Image src={workStationIcon} alt="Work Station Icon" />
                <Flex
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                  pr={2}
                >
                  <Text fontWeight={activeWorkstationId ? 600 : 500}>
                    Workstations
                  </Text>
                  <Image
                    src={
                      isWorkstationsOpen || activeWorkstationId
                        ? minusIcon
                        : plusIcon
                    }
                    alt={
                      isWorkstationsOpen || activeWorkstationId
                        ? 'Collapse'
                        : 'Expand'
                    }
                    opacity={
                      isWorkstationsOpen || activeWorkstationId ? 1 : 0.6
                    }
                  />
                </Flex>
              </Flex>

              {(isWorkstationsOpen || activeWorkstationId) && (
                <Box spaceY={3} mt={4}>
                  {workstations.map((workstation) => {
                    const isActive = activeWorkstationId === workstation.id;
                    return (
                      <Box
                        key={workstation.id}
                        cursor="pointer"
                        onClick={() => handleWorkstationClick(workstation.id)}
                      >
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          bg={isActive ? '#F5F5F5' : 'white'}
                          py={2}
                          pr={2}
                          borderRadius={5}
                        >
                          <Text
                            fontWeight={isActive ? 500 : 400}
                            color={isActive ? '#111723' : '#4A5565'}
                            pl={9}
                          >
                            {workstation.name}
                          </Text>
                          <Image
                            src={isActive ? minusIcon : plusIcon}
                            alt={isActive ? 'Minus Icon' : 'Plus Icon'}
                            opacity={isActive ? 1 : 0.6}
                          />
                        </Flex>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>

            <Box>
              <Flex
                gap={3}
                alignItems="center"
                cursor="pointer"
                onClick={handleProjectsToggle}
                _hover={{ opacity: 0.7 }}
              >
                <Image src={projectsIcon} alt="Projects Icon" />
                <Flex
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                  pr={2}
                >
                  <Text fontWeight={activeProjectId ? 600 : 500}>
                    All Projects
                  </Text>
                  <Image
                    src={isProjectsOpen || activeProjectId ? minusIcon : plusIcon}
                    alt={isProjectsOpen || activeProjectId ? 'Collapse' : 'Expand'}
                    opacity={isProjectsOpen || activeProjectId ? 1 : 0.6}
                  />
                </Flex>
              </Flex>

              {(isProjectsOpen || activeProjectId) && (
                <Box spaceY={3} mt={4}>
                  {projects.map((project) => {
                    const isActive = activeProjectId === project.id;
                    return (
                      <Box
                        key={project.id}
                        cursor="pointer"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          bg={isActive ? '#F5F5F5' : 'white'}
                          py={2}
                          pr={2}
                          borderRadius={5}
                        >
                          <Text
                            fontWeight={isActive ? 500 : 400}
                            color={isActive ? '#111723' : '#4A5565'}
                            pl={9}
                          >
                            {project.name}
                          </Text>
                          <Image
                            src={isActive ? minusIcon : plusIcon}
                            alt={isActive ? 'Minus Icon' : 'Plus Icon'}
                            opacity={isActive ? 1 : 0.6}
                          />
                        </Flex>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>

            <Flex gap={3} alignItems="center">
              <Image src={historyIcon} alt="History Icon" />
              <Text>History</Text>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
