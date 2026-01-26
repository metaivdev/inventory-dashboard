import { Box, Button, Text, Image } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import meta4logo from '../assets/meta4.png';
import messageIcon from '../assets/icons/message-icon.svg';
import { Meta4ERPInputField } from '../components/ui/Meta4ERPInputField';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { forgotPasswordAsync, clearError } from '../store/authSlice';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationError) setValidationError(null);
    if (error) dispatch(clearError());
    if (isSuccess) setIsSuccess(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setIsSuccess(false);

    // Validation
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address');
      return;
    }

    try {
      await dispatch(
        forgotPasswordAsync({
          email: email.trim(),
        })
      ).unwrap();

      setIsSuccess(true);
      // Optionally navigate after a delay or show success message
    } catch (err) {
      console.error('Forgot password error:', err);
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
          Forgot your password?
        </Text>

        <Text color="#4F4F4F">
          Enter your email to receive password reset link
        </Text>

        <form onSubmit={handleSubmit}>
          <Box color="black" mt={5}>
            <Meta4ERPInputField
              label="Email"
              type="email"
              placeholder="Enter your work email"
              icon={messageIcon}
              iconAlt="message icon"
              value={email}
              onChange={handleChange}
            />
          </Box>

          {isSuccess && (
            <Text color="green.500" fontSize="sm" mt={2}>
              Password reset link has been sent to your email!
            </Text>
          )}

          {(error || validationError) && !isSuccess && (
            <Text color="red.500" fontSize="sm" mt={2}>
              {validationError || error}
            </Text>
          )}

          <Button
            type="submit"
            borderRadius="8px"
            w="100%"
            bg="#111723"
            mt={7}
            loading={isLoading}
            loadingText="Sending..."
            disabled={isLoading}
          >
            Send Code
          </Button>
        </form>
        <Text
          textDecoration="underline"
          my={4}
          color="#111723"
          textAlign={'center'}
          cursor="pointer"
          onClick={() => navigate('/login')}
        >
          Remember your password?{' '}
          <span style={{ fontWeight: 600 }}>Sign in</span>
        </Text>
      </Box>
    </Box>
  );
};
