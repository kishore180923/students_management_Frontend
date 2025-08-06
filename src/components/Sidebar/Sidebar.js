import React, { useState } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Students');
  const navigate = useNavigate();

  const navItems = [
    { name: 'Students', icon: UserGroupIcon, path: '/students' },
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Dashboard', icon: DocumentTextIcon, path: '/' },
    { name: 'Reports', icon: ChartBarIcon, path: '/' },
  ];

  const handleNavigation = (name, path) => {
    setActiveItem(name);
    navigate(path);
  };

  const handleLogout = () => {
    // Add any logout logic here (clearing tokens, etc.)
    navigate('/login'); // Directly navigate to login page
  };

  return (
    <div
      className={`fixed flex flex-col h-screen transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-gray-200`}
    >
      {/* Logo Section */}
      <div
        className={`flex items-center ${
          collapsed ? 'justify-center py-5' : 'justify-between px-4 py-5'
        } border-b border-gray-200`}
      >
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-800">DashboardPro</h1>
        )}
      </div>

      {/* Main Navigation - This will take up remaining space */}
      <div className="flex-1 overflow-y-auto">
        <nav className="py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.name, item.path)}
                  className={`w-full flex items-center rounded-lg p-3 transition-all ${
                    activeItem === item.name
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <item.icon className={`h-6 w-6 ${!collapsed && 'mr-3'}`} />
                  {!collapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Fixed Logout Button at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-lg p-3 text-gray-600 hover:bg-gray-100 ${
            collapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <ArrowLeftOnRectangleIcon className={`h-6 w-6 ${!collapsed && 'mr-3'}`} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;