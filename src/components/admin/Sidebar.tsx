'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Logo from '@/app/assets/logo/Logo.jpg'
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  Car, 
  Clock, 
  FileText, 
  Settings
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
          <h1 className="text-xl flex justify-center items-center gap-2 font-bold text-gray-900">
            <Image
              src={Logo}
              alt="Fleet Manager Logo"
              width={80}
              height={80}
              className='h-10 w-auto rounded-full object-cover'
            />
            <span className='font-bold'>LASU Fleet</span>
          </h1>
        </div>
        
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
              <span className="text-gray-600 text-sm font-medium">AD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <Link href="/">
                <button className="text-xs font-medium text-gray-500 hover:text-gray-700">
                  Sign out
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
