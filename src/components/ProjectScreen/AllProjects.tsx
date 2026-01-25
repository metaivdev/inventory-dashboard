import { Box, Flex, Text } from '@chakra-ui/react';
import { Meta4ERPInputField } from '../ui/Meta4ERPInputField';
import searchIcon from '../../assets/icons/search.svg';
import { Meta4ERPButton } from '../ui/Meta4ERPButton';
import plusIcon from '../../assets/icons/plus.svg';
import { ProjectsTable } from './ProjectsTable';
import { useProjectStore } from '../../store';

export const AllProjects = () => {
  const { openNewProject, projects } = useProjectStore();

  return (
    <Box>
      <Text fontSize="22px" fontWeight={500} color="#111723">
        All Projects
      </Text>
      <Text color="#4A5565">Search for project</Text>

      <Box pt={5}>
        <Flex justifyContent={'space-between'}>
          <Meta4ERPInputField
            icon={searchIcon}
            type="text"
            placeholder="Search for project"
          />

          <Meta4ERPButton
            icon={plusIcon}
            color="#D6EAF5"
            onClick={openNewProject}
          >
            Create Project
          </Meta4ERPButton>
        </Flex>
      </Box>

      <Box mt={7}>
        <ProjectsTable data={projects} />
      </Box>
    </Box>
  );
};
