import { Box, Grid, Text } from '@chakra-ui/react';
import { Workstation } from './Workstation';
import { useWorkstationStore } from '../../store';
import { Meta4ERPInputField } from '../ui/Meta4ERPInputField';
import searchIcon from '../../assets/icons/search.svg';

export const Workstations = () => {
  const { workstations } = useWorkstationStore();

  return (
    <Box>
      <Box>
        <Text fontSize="22px" fontWeight={500} color="#111723">
          All Workstations
        </Text>
        <Text color="#4A5565">Search for workstation</Text>
        <Meta4ERPInputField
          icon={searchIcon}
          type="text"
          width="340px"
          placeholder="Search for workstation"
        />
      </Box>

      <Grid templateColumns="1fr 1fr 1fr 1fr" gap={4} mt={12}>
        {workstations.map((workstation) => (
          <Workstation key={workstation.id} workstation={workstation} />
        ))}
      </Grid>
    </Box>
  );
};
