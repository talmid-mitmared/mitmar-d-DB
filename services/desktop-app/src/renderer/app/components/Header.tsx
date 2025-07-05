import { Button } from './shared/ui/Button';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        <div className="text-primary font-['Pacifico'] text-xl">logo</div>
        <div className="text-gray-700 text-sm font-medium">Database Manager</div>
        <div className="flex items-center ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          Connected
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <div className="w-4 h-4 flex items-center justify-center text-gray-400">
              <i className="ri-search-line" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center">
          <i className="ri-notification-3-line" />
        </button>

        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded !rounded-button">
          <i className="ri-settings-3-line" />
        </button>
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
          <span className="text-sm font-medium">JS</span>
        </div>
      </div>
    </header>
  );
}
