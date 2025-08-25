'use client';

import { useState } from 'react';
import { RiPlayLine, RiSaveLine, RiFormatClear, RiDownloadLine } from 'react-icons/ri';
import { Button } from '../../shared/ui/Button';

export default function SQLEditor() {
  const [query, setQuery] = useState('SELECT * FROM users');

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white" id="sqlView">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 flex flex-col overflow-hidden border-r border-gray-200">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded whitespace-nowrap">
                <RiPlayLine className="w-4 h-4" />
                <span>Run Query</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded whitespace-nowrap"
              >
                <RiSaveLine className="w-4 h-4" />
                <span>Save</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded whitespace-nowrap"
              >
                <RiFormatClear className="w-4 h-4" />
                <span>Format</span>
              </Button>
            </div>
          </div>
          <textarea
            className="flex-1 p-4 text-sm font-mono focus:outline-none bg-gray-50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
            placeholder="Type your query here..."
          />
        </div>

        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-700">Query Results</div>
              <div className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Success
              </div>
              <div className="text-xs text-gray-500">Executed in 0.023s</div>
            </div>
            <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded whitespace-nowrap">
              <RiDownloadLine className="w-3 h-3" />
              <span>Export</span>
            </button>
          </div>
          <div className="flex-1 overflow-auto fade-in">
            <table className="w-full border-collapse bg-white">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-700 p-2">ID</th>
                  <th className="text-left text-xs font-medium text-gray-700 p-2">Username</th>
                  <th className="text-left text-xs font-medium text-gray-700 p-2">Email</th>
                  <th className="text-left text-xs font-medium text-gray-700 p-2">Created At</th>
                  <th className="text-left text-xs font-medium text-gray-700 p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-xs text-gray-800 p-2">1</td>
                  <td className="text-xs text-gray-800 p-2">johndoe</td>
                  <td className="text-xs text-gray-800 p-2">john.doe@example.com</td>
                  <td className="text-xs text-gray-800 p-2">2025-04-10 14:32:45</td>
                  <td className="text-xs text-green-800 bg-green-100 rounded-full p-1 text-center w-fit">
                    Active
                  </td>
                </tr>
                <tr>
                  <td className="text-xs text-gray-800 p-2">2</td>
                  <td className="text-xs text-gray-800 p-2">janesmith</td>
                  <td className="text-xs text-gray-800 p-2">jane.smith@example.com</td>
                  <td className="text-xs text-gray-800 p-2">2025-04-12 09:15:22</td>
                  <td className="text-xs text-green-800 bg-green-100 rounded-full p-1 text-center w-fit">
                    Active
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
