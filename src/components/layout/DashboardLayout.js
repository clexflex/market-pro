// src/components/layout/DashboardLayout.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Globe,
  PieChart,
  TrendingUp,
  Database,
  Search,
  Settings,
  Bell,
  User,
  Menu,
  X,
  Home,
  FileText,
  Download,
  Filter,
  Users,
  ChevronDown,
  ChevronRight,
  Upload,
  RefreshCw
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Executive Summary',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Overview and key insights'
  },
  {
    name: 'Regional Analysis',
    href: '/dashboard/regional',
    icon: Globe,
    description: 'Geographic market breakdown'
  },
  {
    name: 'Market Segments',
    href: '/dashboard/segments',
    icon: PieChart,
    description: 'Product and customer segments'
  },
  {
    name: 'Growth Analysis',
    href: '/dashboard/growth',
    icon: TrendingUp,
    description: 'Trends and forecasting'
  },
  {
    name: 'Data Explorer',
    href: '/dashboard/explorer',
    icon: Database,
    description: 'Interactive data tables'
  },
  {
    name: 'Competitive Analysis',
    href: '/dashboard/competitive',
    icon: Users,
    description: 'Market players and positioning'
  },
  {
    name: 'Data Management',
    href: '/dashboard/data-management',
    icon: Upload,
    description: 'CSV upload and data processing',
    badge: 'New'
  }
];

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">MarketPro</h1>
              <p className="text-xs text-gray-500">Research Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Market Info */}
        <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Current Study</h3>
          <p className="text-sm text-gray-600 mb-3">Global Skin Boosters Market</p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-500">Market Size 2032</p>
              <p className="font-semibold text-primary-600">$3.2B</p>
            </div>
            <div>
              <p className="text-gray-500">CAGR 2024-32</p>
              <p className="font-semibold text-secondary-600">11.8%</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative",
                    isActive
                      ? "bg-primary-100 text-primary-700 shadow-sm border-l-4 border-primary-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 mr-3 flex-shrink-0",
                    isActive ? "text-primary-600" : "text-gray-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "font-medium truncate",
                        isActive ? "text-primary-700" : "text-gray-700"
                      )}>
                        {item.name}
                      </p>
                      {item.badge && (
                        <Badge 
                          variant="success" 
                          className="text-xs px-2 py-0.5 ml-2"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs truncate mt-0.5",
                      isActive ? "text-primary-600" : "text-gray-500"
                    )}>
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2 bg-white">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Data
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Data
          </Button>
        </div>
      </div>
    </>
  );
};

const DashboardHeader = ({ onMenuClick, title, breadcrumb }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            {breadcrumb && (
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <Home className="w-4 h-4" />
                <span>/</span>
                {breadcrumb.map((item, index) => (
                  <span key={index} className="flex items-center space-x-2">
                    <span>{item}</span>
                    {index < breadcrumb.length - 1 && <span>/</span>}
                  </span>
                ))}
              </nav>
            )}
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search insights..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Data Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-700 font-medium">Data Live</span>
          </div>

          {/* Actions */}
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
          </Button>

          {/* User Profile */}
          <Button variant="ghost" size="sm">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

const DashboardLayout = ({ children, title, breadcrumb }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          title={title}
          breadcrumb={breadcrumb}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;