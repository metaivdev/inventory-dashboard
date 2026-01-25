import { Box, Button, Text, Image } from '@chakra-ui/react';
import meta4logo from '../assets/meta4.png';
import messageIcon from '../assets/icons/message-icon.svg';
import { Meta4ERPInputField } from '../components/ui/Meta4ERPInputField';

export const ForgotPassword = () => {
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
      <Box minW="500px" maxW="700px">
        <Image src={meta4logo} alt="Meta4 Logo" w={32} h={6} my={4} />
        <Text color="#111723" fontSize="22px">
          Forgot your password?
        </Text>

        <Text color="#4F4F4F">
          Enter your email to receive password reset link
        </Text>

        <Box color="black" mt={5}>
          <Meta4ERPInputField
            label="Email"
            type="email"
            placeholder="Enter your work email"
            icon={messageIcon}
            iconAlt="message icon"
          />
        </Box>

        <Button borderRadius="8px" w="100%" bg="#111723" mt={7}>
          Send Code
        </Button>
        <Text
          textDecoration="underline"
          my={4}
          color="#111723"
          textAlign={'center'}
        >
          Remember your password?{' '}
          <span style={{ fontWeight: 600 }}>Sign in</span>
        </Text>
      </Box>
    </Box>
  );
};
