import { Box, Flex, Text } from '@chakra-ui/react';

export const Workstation = () => {
  return (
    <Box border="1px solid #D1D5DC" borderRadius="8px" p={4}>
      <Text>Printing Station</Text>
      <Text>Active Projects</Text>
      <Text>Paused Projects</Text>

      <Box>
        <Text>Super Admin</Text>
        <Text>Moyin Oyelohunnu</Text>
      </Box>
    </Box>
  );
};
