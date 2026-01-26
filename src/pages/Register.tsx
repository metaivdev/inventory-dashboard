import { Box, Button, Text, Image } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import meta4logo from '../assets/meta4.png';
import messageIcon from '../assets/icons/message-icon.svg';
import passwordIcon from '../assets/icons/password-icon.svg';
import { Meta4ERPInputField } from '../components/ui/Meta4ERPInputField';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUserAsync, clearError } from '../store/authSlice';

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (validationError) setValidationError(null);
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!formData.firstName.trim()) {
      setValidationError('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setValidationError('Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!formData.password) {
      setValidationError('Password is required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await dispatch(
        registerUserAsync({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: 'STAFF',
          department: '',
          stations: [],
        })
      ).unwrap();

      // Navigate to login page after successful registration
      navigate('/login');
    } catch (err) {
    
      console.error('Registration error:', err);
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
          Create your account
        </Text>

        <Text color="#4F4F4F">Join Meta-IV ERP Solutions</Text>

        <form onSubmit={handleSubmit}>
          <Box color="black" mt={5} spaceY={7}>
            <Meta4ERPInputField
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange('firstName')}
            />

            <Meta4ERPInputField
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange('lastName')}
            />

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
              label="Create Password"
              type="password"
              placeholder="Create a password"
              icon={passwordIcon}
              iconAlt="password icon"
              value={formData.password}
              onChange={handleChange('password')}
            />

            <Meta4ERPInputField
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              icon={passwordIcon}
              iconAlt="password icon"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
            />
          </Box>

          {(error || validationError) && (
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
            loadingText="Signing Up..."
            disabled={isLoading}
          >
            Sign Up
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
          Already have an account?{' '}
          <span style={{ fontWeight: 600 }}>Sign in</span>
        </Text>
      </Box>
    </Box>
  );
};
