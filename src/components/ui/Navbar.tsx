'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplets, Map, FileText, BarChart3, Home, Info, Plus, AlertTriangle } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Map', icon: Map },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/evacuation', label: 'Evacuation', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/sos', label: 'SOS', icon: AlertTriangle },
  { href: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Droplets className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <span className="text-base md:text-lg font-bold text-slate-900">Bahala</span>
              <span className="text-[10px] md:text-xs text-slate-500 block -mt-1 hidden sm:block">Flood Awareness</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const isSOS = link.href === '/sos';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSOS
                      ? 'text-red-600 hover:bg-red-50'
                      : isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Report Button - hidden on mobile since bottom nav has it */}
          <div className="flex items-center gap-3">
            <Link
              href="/report"
              className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Report Flood</span>
            </Link>

            {/* Mobile: SOS quick access */}
            <Link
              href="/sos"
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-200"
              aria-label="SOS Emergency"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
