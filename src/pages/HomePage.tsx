import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function HomePage() {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);

  return (
    <MainLayout
      sidebar={
        <Sidebar
          selectedDocumentIds={selectedDocumentIds}
          onSelectionChange={setSelectedDocumentIds}
        />
      }
    >
      <ChatInterface selectedDocumentIds={selectedDocumentIds} />
    </MainLayout>
  );
}
