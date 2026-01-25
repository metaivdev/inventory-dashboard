import type { ReactNode } from 'react';
import { useState } from 'react';
import { Table, Box, Checkbox, Flex } from '@chakra-ui/react';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T> {
  icon: ReactNode;
  onClick: (item: T) => void;
  tooltip?: string;
}

export interface Meta4ERPTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  showCheckboxes?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  idKey?: keyof T;
}

export function Meta4ERPTable<T extends object>({
  data,
  columns,
  actions = [],
  showCheckboxes = false,
  onSelectionChange,
  idKey = 'id' as keyof T,
}: Meta4ERPTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const getItemId = (item: T, index: number): string => {
    const id = item[idKey];
    return id ? String(id) : String(index);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((item, index) => getItemId(item, index));
      setSelectedIds(new Set(allIds));
      onSelectionChange?.(allIds);
    } else {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedIds(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const isAllSelected =
    data.length > 0 &&
    data.every((item, index) => selectedIds.has(getItemId(item, index)));

  const renderCell = (item: T, column: TableColumn<T>): ReactNode => {
    if (column.render) {
      return column.render(item);
    }
    const value = item[column.key];
    return String(value ?? '');
  };

  return (
    <Box
      color="#4A5565"
      borderRadius="12px"
      overflow="hidden"
      border="1px solid #E5E5E5"
    >
      <Table.Root
        size="md"
        variant="outline"
        showColumnBorder
        css={{
          '& th, & td': {
            borderColor: '#E5E5E5',
          },
        }}
      >
        <Table.Header>
          <Table.Row fontWeight={600} bg="#F8F8FA">
            {showCheckboxes && (
              <Table.ColumnHeader
                fontWeight={600}
                width="50px"
                borderRight="1px solid #E5E5E5"
              >
                <Box display="flex" justifyContent="center">
                  <Checkbox.Root
                    checked={isAllSelected}
                    onCheckedChange={(e) => handleSelectAll(!!e.checked)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control borderRadius="4px" />
                  </Checkbox.Root>
                </Box>
              </Table.ColumnHeader>
            )}

            {columns.map((column, colIndex) => (
              <Table.ColumnHeader
                key={String(column.key)}
                width={column.width}
                textAlign={column.align || 'left'}
                color="#111723"
                fontSize="14px"
                fontWeight={500}
                py={4}
                borderRight={
                  colIndex < columns.length - 1 || actions.length > 0
                    ? '1px solid #E5E5E5'
                    : undefined
                }
              >
                {column.label}
              </Table.ColumnHeader>
            ))}

            {actions.length > 0 && (
              <Table.ColumnHeader
                color="#111723"
                fontSize="14px"
                fontWeight={500}
                py={4}
              >
                Actions
              </Table.ColumnHeader>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item, index) => {
            const itemId = getItemId(item, index);
            const isSelected = selectedIds.has(itemId);

            return (
              <Table.Row key={itemId} _hover={{ bg: 'gray.50' }}>
                {showCheckboxes && (
                  <Table.Cell borderRight="1px solid #E5E5E5">
                    <Box display="flex" justifyContent="center">
                      <Checkbox.Root
                        checked={isSelected}
                        onCheckedChange={(e) =>
                          handleSelectItem(itemId, !!e.checked)
                        }
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control borderRadius="4px" />
                      </Checkbox.Root>
                    </Box>
                  </Table.Cell>
                )}

                {columns.map((column, colIndex) => (
                  <Table.Cell
                    key={String(column.key)}
                    py={4}
                    textAlign={column.align || 'left'}
                    borderRight={
                      colIndex < columns.length - 1 || actions.length > 0
                        ? '1px solid #E5E5E5'
                        : undefined
                    }
                  >
                    {renderCell(item, column)}
                  </Table.Cell>
                ))}

                {actions.length > 0 && (
                  <Table.Cell py={4}>
                    <Flex gap={2}>
                      {actions.map((action, actionIndex) => (
                        <Box
                          key={actionIndex}
                          cursor="pointer"
                          onClick={() => action.onClick(item)}
                          title={action.tooltip}
                        >
                          {action.icon}
                        </Box>
                      ))}
                    </Flex>
                  </Table.Cell>
                )}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
