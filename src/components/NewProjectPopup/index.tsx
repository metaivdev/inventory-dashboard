import { Box, Flex, Text, Textarea } from '@chakra-ui/react';
import { Meta4ERPInputField } from '../ui/Meta4ERPInputField';
import { Meta4ERPButton } from '../ui/Meta4ERPButton';
import plusIcon from '../../assets/icons/plus.svg';
import { Meta4ERPSelect } from '../ui/Meta4ERPSelect';
import { useProjectStore } from '../../store';

export const NewProjectPopup = () => {
  const { closeNewProject } = useProjectStore();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeNewProject();
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
              Create New Project
            </Text>
            <Text color="#4A5565">Follow the steps to create a new system</Text>
          </Box>
          <Box
            as="button"
            onClick={closeNewProject}
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
          <Meta4ERPInputField
            label="Project Name"
            type="text"
            placeholder="Name of project"
          />

          <Box>
            <Text>Description</Text>
            <Textarea
              placeholder="Enter description of project here"
              bg="#F8F8F8"
              border="1px solid #D1D5DC"
              borderRadius="10px"
              p={2}
              h="100px"
            />
          </Box>

          <Flex gap={4}>
            <Box flex={1}>
              <Meta4ERPInputField
                label="Quantity of products"
                type="number"
                placeholder="0"
              />
            </Box>

            <Box flex={1}>
              <Meta4ERPSelect
                label="Category"
                placeholder="Select category"
                multiple
                options={[
                  { label: 'Category 1', value: 'category-1' },
                  { label: 'Category 2', value: 'category-2' },
                  { label: 'Category 3', value: 'category-3' },
                ]}
              />
            </Box>
          </Flex>

          <Meta4ERPSelect
            label="Work stations"
            placeholder="Select work stations"
            multiple
            options={[
              { label: 'Work Station 1', value: 'workstation-1' },
              { label: 'Work Station 2', value: 'workstation-2' },
              { label: 'Work Station 3', value: 'workstation-3' },
            ]}
          />

          <Meta4ERPButton icon={plusIcon} width={'100%'} onClick={() => {}}>
            Create new
          </Meta4ERPButton>
        </Box>
      </Box>
    </Box>
  );
};
