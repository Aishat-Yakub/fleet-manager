'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';

type ActiveTab = 'vehicles' | 'fuel-requests' | 'maintenance-requests' | 'condition-updates';

interface HeaderAndTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function HeaderAndTabs({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery
}: HeaderAndTabsProps) {
  const [currentMobileTabIndex, setCurrentMobileTabIndex] = useState(0);
  
  const tabs = useMemo(() => [
    { id: 'vehicles', name: 'Vehicles' },
    { id: 'fuel-requests', name: 'Fuel' },
    { id: 'maintenance-requests', name: 'Maintenance' },
    { id: 'condition-updates', name: 'Conditions' }
  ] as const, []);

  // Update mobile tab index when active tab changes
  useEffect(() => {
    const tabIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (tabIndex !== -1) {
      setCurrentMobileTabIndex(tabIndex);
    }
  }, [activeTab, tabs]);

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-transparent rounded-lg border overflow-hidden">
        <div className="px-2 xs:px-3 py-3 xs:py-4 sm:px-4 sm:py-5">
          <div className="flex flex-col space-y-3 xs:space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 truncate">Auditor Dashboard</h1>
                <p className="mt-0.5 xs:mt-1 text-xs xs:text-sm text-gray-500 truncate">Monitor fleet activities and requests</p>
              </div>
              {/* Mobile navigation arrows */}
              <div className="sm:hidden flex items-center space-x-1 xs:space-x-2 ml-2 xs:ml-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-1.5 xs:p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => {
                    const newIndex = Math.max(0, currentMobileTabIndex - 1);
                    setCurrentMobileTabIndex(newIndex);
                    setActiveTab(tabs[newIndex].id);
                  }}
                  disabled={currentMobileTabIndex === 0}
                  aria-label="Previous tab"
                >
                  
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-1.5 xs:p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => {
                    const newIndex = Math.min(tabs.length - 1, currentMobileTabIndex + 1);
                    setCurrentMobileTabIndex(newIndex);
                    setActiveTab(tabs[newIndex].id);
                  }}
                  disabled={currentMobileTabIndex === tabs.length - 1}
                  aria-label="Next tab"
                >
                  
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-3 xs:space-y-4 sm:space-y-0 sm:flex-row sm:space-x-3 xs:sm:space-x-4 sm:items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-40 xs:sm:w-48 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-2 xs:pl-3 flex items-center pointer-events-none">
                  <Search className="h-3 w-3 xs:h-4 xs:w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-8 xs:pl-10 pr-2 xs:pr-3 py-1.5 xs:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 xs:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs xs:text-sm transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search across all data"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Selector */}
      <div className="sm:hidden">
        <div className=" border border-blue-200 rounded-lg px-3 xs:px-4 py-2 xs:py-3 flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <span className="font-medium text-blue-700 truncate">
              {tabs[currentMobileTabIndex]?.name}
            </span>
          </div>
          <div className="flex items-center space-x-1 xs:space-x-2 ml-2 xs:ml-4">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {currentMobileTabIndex + 1} / {tabs.length}
            </span>
          </div>
        </div>
        <div className="mt-2 flex justify-center space-x-1 xs:space-x-2">
          {tabs.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentMobileTabIndex(index);
                setActiveTab(tabs[index].id);
              }}
              className={`w-1.5 xs:w-2 h-1.5 xs:h-2 rounded-full transition-colors duration-200 ${
                index === currentMobileTabIndex
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${tabs[index].name} tab (${index + 1} of ${tabs.length})`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:block bg-transparent rounded-lg border border-gray-200 overflow-hidden">
        <nav className="flex -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentMobileTabIndex(tabs.findIndex(t => t.id === tab.id));
              }}
              className={`
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 min-w-[80px] xs:min-w-[100px] px-2 xs:px-3 sm:px-4 py-2 xs:py-3 text-center border-b-2 font-medium text-xs xs:text-sm transition-colors duration-200 flex flex-col items-center justify-center
              `}
            >
              <span className="hidden xs:inline">{tab.name}</span>
              <span className="xs:hidden text-xs">{tab.name.substring(0, 4)}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
