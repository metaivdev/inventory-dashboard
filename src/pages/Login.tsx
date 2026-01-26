import { Box, Text, Image, Flex, Checkbox } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import meta4logo from '../assets/meta4.png';
import messageIcon from '../assets/icons/message-icon.svg';
import passwordIcon from '../assets/icons/password-icon.svg';
import { Meta4ERPButton } from '../components/ui/Meta4ERPButton';
import { Meta4ERPInputField } from '../components/ui/Meta4ERPInputField';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUserAsync, clearError } from '../store/authSlice';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (validationError) setValidationError(null);
    if (error) dispatch(clearError());
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!formData.password) {
      setValidationError('Password is required');
      return;
    }

    try {
      await dispatch(
        loginUserAsync({
          email: formData.email.trim(),
          password: formData.password,
        })
      ).unwrap();

      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

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

        <form onSubmit={handleSubmit}>
          <Box color="black" mt={5} spaceY={7}>
            <Meta4ERPInputField
              label="Email"
              type="email"
              placeholder="Enter your work email"
              icon={messageIcon}
              iconAlt="message icon"
              value={formData.email}
              onChange={handleChange('email')}
            />

            <Meta4ERPInputField
              label="Password"
              type="password"
              placeholder="Password"
              icon={passwordIcon}
              iconAlt="password icon"
              value={formData.password}
              onChange={handleChange('password')}
            />
          </Box>

          {(error || validationError) && (
            <Text color="red.500" fontSize="sm" mt={2}>
              {validationError || error}
            </Text>
          )}

          <Flex
            my={5}
            color="#484747"
            justifyContent="space-between"
            alignItems="center"
          >
            <Checkbox.Root
              checked={formData.rememberMe}
              onCheckedChange={handleCheckboxChange}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label fontSize={'16px'}>Remember me</Checkbox.Label>
            </Checkbox.Root>

            <Text
              textDecoration="underline"
              cursor="pointer"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </Text>
          </Flex>
          <Meta4ERPButton
            type="submit"
            loading={isLoading}
            loadingText="Signing In..."
            disabled={isLoading}
            width="100%"
          >
            Sign In
          </Meta4ERPButton>
        </form>
        <Text
          textDecoration="underline"
          my={4}
          color="#111723"
          textAlign={'center'}
          cursor="pointer"
          onClick={() => navigate('/register')}
        >
          Don't have an account?{' '}
          <span style={{ fontWeight: 600 }}>Sign up</span>
        </Text>
      </Box>
    </Box>
  );
};
