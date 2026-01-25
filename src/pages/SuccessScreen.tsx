import { Box, Text, Image } from '@chakra-ui/react';
import successIcon from '../assets/icons/complete-icon.svg';
import { Meta4ERPButton } from '../components/ui/Meta4ERPButton';

export const SuccessScreen = () => {
  return (
    <Box
      bg="#E9E9FF"
      h="100vh"
      w="100vw"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box minW="500px" maxW="700px" textAlign="center">
        <Image src={successIcon} alt="success icon" mx="auto" mb={2} />
        <Text color="#111723" fontSize="22px">
          New password set
        </Text>
        <Text color="#4F4F4F" mt={1}>
          Glad to have you back.
        </Text>

        <Box mt={7}>
          <Meta4ERPButton onClick={() => {}}>
            Go back to sign in page
          </Meta4ERPButton>
        </Box>
      </Box>
    </Box>
  );
};
