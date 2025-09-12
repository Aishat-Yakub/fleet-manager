'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

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
  
  const tabs = [
    { id: 'vehicles', name: 'Vehicles',},
    { id: 'fuel-requests', name: 'Fuel',},
    { id: 'maintenance-requests', name: 'Maintenance',},
    { id: 'condition-updates', name: 'Conditions',}
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="rounded-lg overflow-hidden">
        <div className="px-3 py-4 sm:px-4 sm:py-5 border-b border-gray-200">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">Auditor Dashboard</h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">Monitor fleet activities and requests</p>
              </div>
              {/* Mobile navigation arrows */}
              <div className="sm:hidden flex items-center space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    const newIndex = Math.max(0, currentMobileTabIndex - 1);
                    setCurrentMobileTabIndex(newIndex);
                    setActiveTab(tabs[newIndex].id);
                  }}
                  disabled={currentMobileTabIndex === 0}
                >
                  <ChevronLeft className="block h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    const newIndex = Math.min(tabs.length - 1, currentMobileTabIndex + 1);
                    setCurrentMobileTabIndex(newIndex);
                    setActiveTab(tabs[newIndex].id);
                  }}
                  disabled={currentMobileTabIndex === tabs.length - 1}
                >
                  <ChevronRight className="block h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 sm:items-center">
              <div className="relative w-full sm:w-48 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:block border-b border-gray-200">
        <nav className="-mb-px flex space-x-2 md:space-x-4 lg:space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentMobileTabIndex(tabs.findIndex(t => t.id === tab.id));
              }}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              } whitespace-nowrap py-2 px-3 md:px-4 border-b-2 font-medium text-sm md:text-base transition-colors duration-200 rounded-t-md flex items-center space-x-2`}
            >
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>


      {/* Mobile Tab Selector */}
      <div className="sm:hidden">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium text-blue-700">
              {tabs[currentMobileTabIndex]?.name}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">
              {currentMobileTabIndex + 1} / {tabs.length}
            </span>
          </div>
        </div>
        <div className="mt-2 flex justify-center space-x-1">
          {tabs.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentMobileTabIndex(index);
                setActiveTab(tabs[index].id);
              }}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentMobileTabIndex
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to tab ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
