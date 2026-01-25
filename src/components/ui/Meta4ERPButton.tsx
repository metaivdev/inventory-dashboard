import { Button, Image } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';

interface Meta4ERPButtonProps extends ButtonProps {
  icon?: string;
  iconColor?: 'white' | 'dark';
}

export const Meta4ERPButton = ({
  children,
  icon,
  iconColor = 'white',
  width = 'contain',
  ...rest
}: Meta4ERPButtonProps) => {
  return (
    <Button borderRadius="8px" w={width} bg="#111723" color="white" {...rest}>
      {icon && (
        <Image
          src={icon}
          alt=""
          w={5}
          h={5}
          mr={2}
          filter={iconColor === 'white' ? 'brightness(0) invert(1)' : 'none'}
        />
      )}
      {children}
    </Button>
  );
};
