'use client';

import { RiAddLine } from 'react-icons/ri';

type ColumnMeta = {
  name: string;
  type: string;
  tags?: string[];
};

type IndexMeta = {
  name: string;
  fields: string;
};

const columns: ColumnMeta[] = [
  { name: 'id', type: 'INTEGER', tags: ['PK', 'NOT NULL'] },
  { name: 'username', type: 'TEXT', tags: ['NOT NULL', 'UNIQUE'] },
  { name: 'email', type: 'TEXT', tags: ['NOT NULL', 'UNIQUE'] },
  { name: 'password_hash', type: 'TEXT', tags: ['NOT NULL'] },
  { name: 'created_at', type: 'TIMESTAMP', tags: ['NOT NULL', 'DEFAULT'] },
  { name: 'status', type: 'TEXT', tags: ['NOT NULL', 'DEFAULT'] },
  { name: 'last_login', type: 'TIMESTAMP', tags: ['NULLABLE'] },
];

const indexes: IndexMeta[] = [
  { name: 'idx_users_email', fields: 'email' },
  { name: 'idx_users_status', fields: 'status' },
];

export default function TableSchema() {
  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-2">Table Schema</div>
        <div className="text-xs text-gray-500">users</div>
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 space-y-3">
          {columns.map((col) => (
            <div key={col.name} className="p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-medium text-gray-700">{col.name}</div>
                <div className="text-xs text-gray-500">{col.type}</div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {col.tags?.map((tag) => {
                  const tagStyle = getTagStyle(tag);
                  return (
                    <span key={tag} className={`px-1.5 py-0.5 text-xs rounded ${tagStyle}`}>
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indexes */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-gray-700">Indexes</div>
          <button className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded">
            <RiAddLine />
          </button>
        </div>
        <div className="space-y-2">
          {indexes.map((idx) => (
            <div key={idx.name} className="p-2 bg-gray-50 rounded">
              <div className="text-xs font-medium text-gray-700 mb-1">{idx.name}</div>
              <div className="text-xs text-gray-500">{idx.fields}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTagStyle(tag: string) {
  if (tag === 'PK') return 'bg-blue-100 text-blue-800';
  if (tag === 'NOT NULL') return 'bg-purple-100 text-purple-800';
  if (tag === 'UNIQUE') return 'bg-green-100 text-green-800';
  if (tag === 'DEFAULT') return 'bg-yellow-100 text-yellow-800';
  if (tag === 'NULLABLE') return 'bg-gray-100 text-gray-800';
  return 'bg-gray-200 text-gray-700';
}
