import { useState } from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import projectStageIcon from '../../../assets/icons/project-stage.svg';

const stages = [
  {
    title: 'Project created',
    time: '10:40am | 20 Nov 2025',
    note: 'Note: Lorem ipsum dolor sit amet consectetur. Cras venenatis urna amet at. Id facilisis.',
  },
  {
    title: 'Print Production',
    time: '10:40am | 22 Nov 2025',
    note: 'Note: Lorem ipsum dolor sit amet consectetur. Cras venenatis urna amet at. Id facilisis.',
  },
  {
    title: 'Coating',
    time: '11:15am | 23 Nov 2025',
    note: 'Note: Lorem ipsum dolor sit amet consectetur. Cras venenatis urna amet at. Id facilisis.',
  },
  {
    title: 'Sanding',
    time: '09:30am | 24 Nov 2025',
    note: 'Note: Lorem ipsum dolor sit amet consectetur. Cras venenatis urna amet at. Id facilisis.',
  },
  {
    title: 'Spraying',
    time: '02:20pm | 25 Nov 2025',
    note: 'Note: Lorem ipsum dolor sit amet consectetur. Cras venenatis urna amet at. Id facilisis.',
  },
  {
    title: 'Packaging',
    time: '04:45pm | 26 Nov 2025',
    note: 'Note: Lorem ipsum dolor sit amet consectetur. Cras venenatis urna amet at. Id facilisis.',
  },
];

const printProductionTimelines = [
  {
    title: 'Project Started',
    time: '10:40am | 22 Nov 2025',
    note: 'Note: Print production initiated for Lagos E1 GP Boat project.',
  },
  {
    title: '500 figurines printed',
    time: '1:40pm | 25 Nov 2025',
    note: 'Note: First batch of 500 figurines completed successfully.',
  },
  {
    title: 'Transfer order for 500 figurines to coating',
    time: '5:40pm | 26 Nov 2025',
    note: 'Note: Transfer order created for 500 figurines to move to coating stage.',
  },
  {
    title: 'Transfer order for 200 figurines to coating',
    time: '8:20pm | 27 Nov 2025',
    note: 'Note: Additional batch of 200 figurines transferred to coating.',
  },
];

const coatingTimelines = [
  {
    title: '500 received from printing',
    time: '9:00am | 27 Nov 2025',
    note: 'Note: Received 500 figurines from print production stage.',
  },
  {
    title: '300 coated',
    time: '2:30pm | 27 Nov 2025',
    note: 'Note: Successfully coated 300 figurines with protective layer.',
  },
  {
    title: 'Transfer order for 100 figurines to sanding',
    time: '4:15pm | 28 Nov 2025',
    note: 'Note: Transfer order created for 100 coated figurines to sanding stage.',
  },
  {
    title: '200 coated',
    time: '11:00am | 29 Nov 2025',
    note: 'Note: Completed coating for remaining 200 figurines.',
  },
  {
    title: 'Transfer order for 200 figurines to sanding',
    time: '3:45pm | 29 Nov 2025',
    note: 'Note: Transfer order created for 200 coated figurines to sanding.',
  },
];

const sandingTimelines = [
  {
    title: '100 received from coating',
    time: '10:00am | 29 Nov 2025',
    note: 'Note: Received 100 coated figurines from coating stage.',
  },
  {
    title: '100 sanded',
    time: '3:20pm | 29 Nov 2025',
    note: 'Note: Completed sanding process for 100 figurines.',
  },
  {
    title: 'Transfer order for 100 figurines to spraying',
    time: '5:00pm | 29 Nov 2025',
    note: 'Note: Transfer order created for 100 sanded figurines to spraying stage.',
  },
  {
    title: '200 received from coating',
    time: '9:30am | 30 Nov 2025',
    note: 'Note: Received additional 200 coated figurines from coating.',
  },
  {
    title: '150 sanded',
    time: '2:15pm | 30 Nov 2025',
    note: 'Note: Completed sanding for 150 figurines from second batch.',
  },
];

const sprayingTimelines = [
  {
    title: '100 received from sanding',
    time: '8:00am | 30 Nov 2025',
    note: 'Note: Received 100 sanded figurines from sanding stage.',
  },
  {
    title: '100 sprayed',
    time: '1:30pm | 30 Nov 2025',
    note: 'Note: Completed spraying process for 100 figurines.',
  },
  {
    title: 'Transfer order for 100 figurines to packaging',
    time: '4:00pm | 30 Nov 2025',
    note: 'Note: Transfer order created for 100 sprayed figurines to packaging.',
  },
  {
    title: '150 received from sanding',
    time: '9:00am | 1 Dec 2025',
    note: 'Note: Received 150 sanded figurines from sanding stage.',
  },
  {
    title: '150 sprayed',
    time: '3:45pm | 1 Dec 2025',
    note: 'Note: Completed spraying for all 150 figurines.',
  },
];

const packagingTimelines = [
  {
    title: '100 received from spraying',
    time: '8:30am | 1 Dec 2025',
    note: 'Note: Received 100 sprayed figurines from spraying stage.',
  },
  {
    title: '100 packaged',
    time: '12:00pm | 1 Dec 2025',
    note: 'Note: Successfully packaged 100 figurines for shipment.',
  },
  {
    title: 'Transfer order for 100 figurines to curing',
    time: '2:30pm | 1 Dec 2025',
    note: 'Note: Transfer order created for 100 packaged figurines to curing.',
  },
  {
    title: '150 received from spraying',
    time: '9:00am | 2 Dec 2025',
    note: 'Note: Received 150 sprayed figurines from spraying stage.',
  },
  {
    title: '150 packaged',
    time: '4:00pm | 2 Dec 2025',
    note: 'Note: Completed packaging for remaining 150 figurines.',
  },
];

const tabs = [
  'Overview',
  'Print Production',
  'Coating',
  'Sanding',
  'Spraying',
  'Packaging',
];

const renderTimeline = (timelineData: typeof stages) => {
  return (
    <>
      {timelineData.map((item, index) => (
        <Box key={`${item.title}-${index}`}>
          <Flex alignItems="start" gap={4}>
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Image src={projectStageIcon} alt="project stage" />
              {index < timelineData.length - 1 && (
                <Box
                  w="2px"
                  h="80px"
                  borderLeft="2px"
                  borderStyle="dashed"
                  borderColor="#D1D5DC"
                  mt={2}
                  mb={2}
                />
              )}
            </Box>
            <Box flex={1} pb={index < timelineData.length - 1 ? 10 : 0}>
              <Text fontWeight={500} mb={1}>
                {item.title}
              </Text>
              <Text color="#4A5565" fontSize="14px" mb={1}>
                {item.time}
              </Text>
              <Text color="#4A5565" fontSize="14px">
                {item.note}
              </Text>
            </Box>
          </Flex>
        </Box>
      ))}
    </>
  );
};

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderTabContent = () => {
    if (activeTab === 'Overview') {
      return renderTimeline(stages);
    }

    if (activeTab === 'Print Production') {
      return renderTimeline(printProductionTimelines);
    }

    if (activeTab === 'Coating') {
      return renderTimeline(coatingTimelines);
    }

    if (activeTab === 'Sanding') {
      return renderTimeline(sandingTimelines);
    }

    if (activeTab === 'Spraying') {
      return renderTimeline(sprayingTimelines);
    }

    if (activeTab === 'Packaging') {
      return renderTimeline(packagingTimelines);
    }

    return null;
  };

  return (
    <Box>
      <Flex
        bg="#F8F8F8"
        w="100%"
        color="#111723"
        borderTop="1px solid #D1D5DC"
        borderLeft="1px solid #D1D5DC"
        borderRight="1px solid #D1D5DC"
      >
        {tabs.map((tab, index) => (
          <Box
            key={tab}
            py={3}
            px={8}
            borderRight={index < tabs.length - 1 ? '1px solid #D1D5DC' : 'none'}
            borderBottom={activeTab === tab ? 'none' : '1px solid #D1D5DC'}
            bg={activeTab === tab ? 'white' : '#F8F8F8'}
            cursor="pointer"
            onClick={() => setActiveTab(tab)}
            _hover={{ bg: activeTab === tab ? 'white' : '#F0F0F0' }}
          >
            <Text fontWeight={400}>{tab}</Text>
          </Box>
        ))}
      </Flex>

      <Box
        bg="white"
        w="100%"
        pt={12}
        borderRight="1px solid #D1D5DC"
        borderLeft="1px solid #D1D5DC"
        borderBottom="1px solid #D1D5DC"
        px={5}
      >
        {renderTabContent()}
      </Box>
    </Box>
  );
};
