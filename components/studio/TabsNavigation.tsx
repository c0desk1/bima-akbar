'use client';

import React from 'react';

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  const tabs = [
    { name: 'Postingan', id: 'posts' },
    { name: 'Kategori', id: 'categories' },
    { name: 'Musik', id: 'music' },
    { name: 'Afiliasi', id: 'affiliates' },
  ];

  return (
    <div className="border-b border-white/10 mb-8">
      <nav id="tabs-container" className="-mb-px flex space-x-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab={tab.id}
            className={`tab-btn py-4 px-1 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'active text-white border-b-indigo-500' : 'text-slate-400 hover:text-white'}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}