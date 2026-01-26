import { Box, Button, Text, Image } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import meta4logo from '../assets/meta4.png';
import passwordIcon from '../assets/icons/password-icon.svg';
import { Meta4ERPInputField } from '../components/ui/Meta4ERPInputField';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetPasswordAsync, clearError } from '../store/authSlice';

export const SetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState<string | null>(
    !token ? 'Invalid or missing reset token' : null
  );

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (validationError) setValidationError(null);
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!token) {
      setValidationError('Invalid or missing reset token');
      return;
    }

    // Validation
    if (!formData.newPassword) {
      setValidationError('New password is required');
      return;
    }
    if (formData.newPassword.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await dispatch(
        resetPasswordAsync({
          token,
          newPassword: formData.newPassword,
        })
      ).unwrap();

      // Navigate to login page after successful password reset
      navigate('/login');
    } catch (err) {
      console.error('Password reset error:', err);
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
          Set new password
        </Text>

        <Text color="#4F4F4F">Create a new password for your account</Text>

        <form onSubmit={handleSubmit}>
          <Box color="black" mt={5} spaceY={7}>
            <Meta4ERPInputField
              label="New Password"
              type="password"
              placeholder="Enter new password"
              icon={passwordIcon}
              iconAlt="password icon"
              value={formData.newPassword}
              onChange={handleChange('newPassword')}
            />

            <Meta4ERPInputField
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
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
            loadingText="Resetting Password..."
            disabled={isLoading || !token}
          >
            Reset Password
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
          Back to <span style={{ fontWeight: 600 }}>Sign in</span>
        </Text>
      </Box>
    </Box>
  );
};
