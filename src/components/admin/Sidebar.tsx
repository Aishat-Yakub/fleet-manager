'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Clock, 
  FileText
} from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  group?: string;
};

const navItems: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: <LayoutDashboard className="w-5 h-5" />,
    group: 'Overview'
  },
  
  // User   
  { 
    name: 'All Users', 
    href: '/admin/users', 
    icon: <Users className="w-5 h-5" />,
    group: 'User Management'
  },

  // { 
  //   name: 'Manage Admins', 
  //   href: '/admin', 
  //   icon: <ShieldCheck className="w-5 h-5" />,
  //   group: 'User Management'
  // },
  
  // Vehicle Management
  { 
    name: 'Vehicles', 
    href: '/admin/vehicles', 
    icon: <Car className="w-5 h-5" />,
    group: 'Vehicle Management'
  },
  { 
    name: 'Manage', 
    href: '/admin/manager', 
    icon: <Clock className="w-5 h-5" />,
    group: 'Vehicle Management'
  },
  
  // Audit & Logs
  { 
    name: 'Audit Logs', 
    href: '/admin/auditors', 
    icon: <FileText className="w-5 h-5" />,
    group: 'Audit & Monitoring'
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void } = {}) {
  const pathname = usePathname();

  return (
  <div className="flex flex-col w-64 h-full border-l ba border-gray-200 bg-white shadow-lg z-50">
      {/* Mobile close button */}
      {onClose && (
        <div className="flex items-center justify-between px-4 py-3 border-b lg:hidden">
          <span className="font-bold text-lg"></span>
          <button onClick={onClose} aria-label="Close sidebar" className="text-gray-700 focus:outline-none">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
  {/* Logo removed from sidebar, now outside in layout header */}
      {/* Navigation */}
      <nav className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-3 py-4 space-y-6">
          {(() => {
            // Group items by their group (or 'General' if no group)
            const groupedItems = navItems.reduce((acc, item) => {
              const group = item.group || 'General';
              if (!acc[group]) {
                acc[group] = [];
              }
              acc[group].push(item);
              return acc;
            }, {} as Record<string, NavItem[]>);

            return Object.entries(groupedItems).map(([group, items]) => (
              <div key={group} className="space-y-1">
                {group !== 'General' && (
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group}
                  </h3>
                )}
                {items.map((item) => {
                  const isActive = pathname === item.href || 
                                 (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={onClose}
                    >
                      <span 
                        className={`mr-3 ${
                          isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      >
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      </nav>
      {/* User section */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sky-950 text-sm font-medium">AD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-sky-950">Admin User</p>
            <Link href="/">
              <button className="text-xs font-medium text-sky-950 hover:text-gray-700">
                Sign out
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
