import { Box, Text, Image, Flex, Checkbox } from '@chakra-ui/react';
import meta4logo from '../assets/meta4.png';
import messageIcon from '../assets/icons/message-icon.svg';
import passwordIcon from '../assets/icons/password-icon.svg';
import { Meta4ERPButton } from '../components/ui/Meta4ERPButton';
import { Meta4ERPInputField } from '../components/ui/Meta4ERPInputField';

export const Login = () => {
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
          Welcome to Meta-IV ERP Solutions
        </Text>

        <Text color="#4F4F4F">Sign into your account </Text>

        <Box color="black" mt={5} spaceY={7}>
          <Meta4ERPInputField
            label="Email"
            type="email"
            placeholder="Enter your work email"
            icon={messageIcon}
            iconAlt="message icon"
          />

          <Meta4ERPInputField
            label="Password"
            type="password"
            placeholder="Password"
            icon={passwordIcon}
            iconAlt="password icon"
          />
        </Box>

        <Flex
          my={5}
          color="#484747"
          justifyContent="space-between"
          alignItems="center"
        >
          <Checkbox.Root>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label fontSize={'16px'}>Remember me</Checkbox.Label>
          </Checkbox.Root>

          <Text textDecoration="underline">Forgot password?</Text>
        </Flex>
        <Meta4ERPButton onClick={() => {}}>Sign In</Meta4ERPButton>
        <Text
          textDecoration="underline"
          my={4}
          color="#111723"
          textAlign={'center'}
        >
          Don't have an account?{' '}
          <span style={{ fontWeight: 600 }}>Sign up</span>
        </Text>
      </Box>
    </Box>
  );
};
