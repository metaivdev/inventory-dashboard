import { Box, Input, Text, Image, InputGroup } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';

interface Meta4ERPInputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: string;
  iconAlt?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Meta4ERPInputField = ({
  label,
  type = 'text',
  placeholder = '',
  icon,
  iconAlt = 'input icon',
  value,
  onChange,
}: Meta4ERPInputFieldProps) => {
  return (
    <Box>
      {label && <Text color="black">{label}</Text>}
      <InputGroup
        flex="1"
        bg="#F8F8F8"
        mt={2}
        borderRadius="8px"
        border="1px solid #D1D5DC"
        startElement={icon ? <Image src={icon} alt={iconAlt} /> : undefined}
      >
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </InputGroup>
    </Box>
  );
};
