import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { ProjectOverview } from '../components/ProjectOverview';

export const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <Box>
      <ProjectOverview projectId={projectId} />
    </Box>
  );
};
