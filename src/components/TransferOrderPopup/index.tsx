import { useState } from 'react';
import { Box, Flex, Text, Textarea } from '@chakra-ui/react';
import { Meta4ERPInputField } from '../ui/Meta4ERPInputField';
import { Meta4ERPButton } from '../ui/Meta4ERPButton';
import plusIcon from '../../assets/icons/plus.svg';
import { Meta4ERPSelect } from '../ui/Meta4ERPSelect';
import { useProjectStore } from '../../store';

export const TransferOrderPopup = () => {
  const { closeTransferOrder } = useProjectStore();
  const [quantity, setQuantity] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedWorkstations, setSelectedWorkstations] = useState<string[]>(
    []
  );
  const [description, setDescription] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);

  const handleSubmit = () => {
    // Handle form submission here
    console.log({
      quantity,
      selectedCategory,
      selectedWorkstations,
      description,
    });
    // Close popup after submissionx
    closeTransferOrder();
    // Reset form
    setQuantity('');
    setSelectedCategory([]);
    setSelectedWorkstations([]);
    setDescription('');
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeTransferOrder();
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.5)"
      zIndex={1000}
      display="flex"
      justifyContent="center"
      alignItems="center"
      onClick={handleBackdropClick}
    >
      <Box
        bg="white"
        color="#111723"
        p={5}
        h="685px"
        w="468px"
        spaceY={2}
        border="1px solid #D1D5DC"
        borderRadius="16px"
        position="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Flex justifyContent="space-between" alignItems="start" mb={2}>
          <Box>
            <Text fontSize="22px" fontWeight={500}>
              Transfer Order Form
            </Text>
            <Text color="#4A5565">
              This information is required to transfer the project workflow.
            </Text>
          </Box>
          <Box
            as="button"
            onClick={closeTransferOrder}
            cursor="pointer"
            fontSize="24px"
            lineHeight="1"
            color="#4A5565"
            _hover={{ color: '#111723' }}
            ml={4}
            aria-label="Close"
          >
            ×
          </Box>
        </Flex>

        <Box pt={5} spaceY={5}>
          <Box>
            <Text color="#111723" fontWeight={500}>
              Project description
            </Text>
            <Text color="#4A5565">
              This project involves creating a high-speed boat for the Lagos E1
              Grand Prix, focusing on innovative design and optimal performance.
            </Text>
          </Box>

          <Box>
            <Flex alignItems="center" justifyContent="space-between" gap={2}>
              <Box>
                <Text>Quantity available for transfer</Text>
                <Text>1000</Text>
              </Box>

              <Box>
                <Text>Date completed</Text>
                <Text>Aug 21, 2026, 10:16</Text>
              </Box>
            </Flex>
          </Box>

          <Box bg="#F8F8F8" borderRadius={'xl'} border="1px solid #D1D5DC">
            <Text borderTopRadius={'xl'} bg="#D6EAF5" fontWeight={500} p={2}>
              Newton cradles
            </Text>
            <Box p={2}>
              <Box>
                <Text>Edit available quantity for transfer and location</Text>
              </Box>

              <Flex gap={4}>
                <Meta4ERPInputField
                  label="Quantity"
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <Box flex={1}>
                  <Meta4ERPSelect
                    label="Location"
                    placeholder="Select location"
                    multiple
                    value={selectedLocation}
                    onChange={(values) =>
                      setSelectedLocation(values as string[])
                    }
                    options={[
                      { label: 'Coating Station', value: 'location-1' },
                      { label: 'Curving Station', value: 'location-2' },
                      { label: 'Sanding Station', value: 'location-3' },
                      { label: 'Spraying Station', value: 'location-4' },
                      { label: 'Packaging Station', value: 'location-5' },
                    ]}
                  />
                </Box>
              </Flex>
            </Box>
          </Box>

          <Box>
            <Text mb={2} fontSize="14px" color="#111723">
              Description
            </Text>
            <Textarea
              placeholder="Enter description of transfer here"
              bg="#F8F8F8"
              border="1px solid #D1D5DC"
              borderRadius="10px"
              p={2}
              h="100px"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <Meta4ERPButton icon={plusIcon} width={'100%'} onClick={handleSubmit}>
            Make transfer
          </Meta4ERPButton>
        </Box>
      </Box>
    </Box>
  );
};
