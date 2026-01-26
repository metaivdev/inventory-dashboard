import type { ReactNode } from 'react';
import { SideBar } from './SideBar';
import { Box, Flex } from '@chakra-ui/react';
import { NewProjectPopup } from './NewProjectPopup';
import { TransferOrderPopup } from './TransferOrderPopup';
import { useProjectStore } from '../store';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isNewProjectOpen, isTransferOrderOpen } = useProjectStore();

  return (
    <Flex minH="100vh" className="bg-slate-900">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Box className="p-8">{children}</Box>
      </main>

      {/* Global Popups */}
      {isNewProjectOpen && <NewProjectPopup />}
      {isTransferOrderOpen && <TransferOrderPopup />}
    </Flex>
  );
}
