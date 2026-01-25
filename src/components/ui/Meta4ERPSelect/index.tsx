import { useMemo } from 'react';
import {
  Box,
  Text,
  Portal,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { groupBy } from 'es-toolkit';

interface SelectOption {
  label: string;
  value: string;
  category?: string;
}

interface Meta4ERPSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  width?: string;
  grouped?: boolean;
  multiple?: boolean;
}

export const Meta4ERPSelect = ({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  width = '100%',
  grouped = false,
  multiple = false,
}: Meta4ERPSelectProps) => {
  const collection = useMemo(
    () => createListCollection({ items: options }),
    [options]
  );

  const categories = useMemo(() => {
    if (!grouped) return null;
    return Object.entries(groupBy(options, (item) => item.category || 'Other'));
  }, [options, grouped]);

  const selectedValue = useMemo(() => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const handleChange = (details: { value: string[] }) => {
    if (!onChange) return;
    if (multiple) {
      onChange(details.value);
    } else {
      onChange(details.value[0]);
    }
  };

  return (
    <Box width={width}>
      {label && <Text color="black">{label}</Text>}
      <Select.Root
        collection={collection}
        size="sm"
        width="100%"
        multiple={multiple}
        value={selectedValue}
        onValueChange={handleChange}
      >
        <Select.HiddenSelect />
        <Select.Control
          bg="#F8F8F8"
          mt={2}
          borderRadius="8px"
          border="1px solid #D1D5DC"
          color="#111723"
        >
          <Select.Trigger>
            <Select.ValueText placeholder={placeholder} color="#111723" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator color="#111723" />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content bg="white" color="#111723">
              {grouped && categories
                ? categories.map(([category, items]) => (
                    <Select.ItemGroup key={category}>
                      <Select.ItemGroupLabel>{category}</Select.ItemGroupLabel>
                      {items.map((item) => (
                        <Select.Item item={item} key={item.value} gap={2}>
                          {multiple && <Select.ItemIndicator />}
                          <Select.ItemText>{item.label}</Select.ItemText>
                          {!multiple && <Select.ItemIndicator />}
                        </Select.Item>
                      ))}
                    </Select.ItemGroup>
                  ))
                : options.map((item) => (
                    <Select.Item item={item} key={item.value} gap={2}>
                      {multiple && <Select.ItemIndicator />}
                      <Select.ItemText>{item.label}</Select.ItemText>
                      {!multiple && <Select.ItemIndicator />}
                    </Select.Item>
                  ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Box>
  );
};
