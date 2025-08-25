import React, { useState } from 'react';
import { Button } from '../../shared/ui/Button';
import { Plus } from 'lucide-react';
import { DataTableDemo } from '../../shared/ui/DataTable';
import SQLEditor from './SQLEditor';

const tabs: { label: string; key: 'table' | 'sql' | 'results' }[] = [
  { label: 'users', key: 'table' },
  { label: 'SQL Editor', key: 'sql' },
];

export const MainView = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'sql' | 'results'>('table');

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 flex items-center px-4 h-10">
        <div className="flex items-center h-full">
          {tabs.map((tab) => (
            <Button
              variant="ghost"
              className={`rounded-none ${activeTab === tab.key ? 'border-b-2 border-b-black' : 'text-gray-400'} hover:bg-transparent`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="ml-auto">
          <Button className=" text-gray-500 hover:text-gray-700 !rounded-button" variant="ghost">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Active View */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {activeTab === 'table' && <DataTableDemo />}
        {activeTab === 'sql' && <SQLEditor />}{' '}
        {/* 
        {activeTab === 'sql' && <SqlEditorView />}
        {activeTab === 'results' && <QueryResultsView />} */}
      </div>
    </main>
  );
};
