import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Award,
  Car,
  WalletCards,
  BarChart3,
  Settings,
  Disc,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { settings } = useApp();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Test & Retest', path: '/tests', icon: Award },
    { name: 'Driving Records', path: '/driving-records', icon: Car },
    { name: 'Fees & Payments', path: '/fees', icon: WalletCards },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#070926]/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0E113C] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#181C54] shadow-xl lg:shadow-none`}
      >
        <div>
          {/* Top Brand Logo with Official Emblem */}
          <div className="px-5 pt-6 pb-5 flex items-center justify-between border-b border-[#181C54]/60">
            <div className="flex items-center gap-3 select-none min-w-0">
              <div className="w-11 h-11 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md ring-2 ring-[#FBA920]/40">
                <img
                  src={settings.logoImage || "/logo.png"}
                  alt={settings.schoolName || "Al Madeena Logo"}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                  {(settings.schoolName || 'Al Madeena').replace(/driving school/gi, '').trim() || 'Al Madeena'}
                </h1>
                <p className="text-[11px] font-medium text-[#94A3B8] mt-0.5 tracking-wide truncate">
                  {settings.tagline || 'Driving School Management'}
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3.5 mt-5 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Check active match
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FBA920] text-[#0E113C] shadow-md shadow-[#FBA920]/25 font-bold'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-[#0E113C]' : 'text-[#94A3B8] group-hover:text-white'
                    }`}
                    strokeWidth={isActive ? 2.4 : 1.9}
                  />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Steering Wheel & Version */}
        <div className="px-6 py-5 border-t border-[#181C54] flex items-center justify-between text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2.5">
            <Disc className="w-4 h-4 text-[#FBA920]" strokeWidth={2.2} />
            <span className="font-semibold tracking-wide text-slate-300">DriveDesk v1.0</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="System Online" />
        </div>
      </aside>
    </>
  );
}
