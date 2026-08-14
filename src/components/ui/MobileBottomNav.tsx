'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, FileText, Home, BarChart3, Plus } from 'lucide-react';

const bottomNavLinks = [
  { href: '/', label: 'Map', icon: Map },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/report', label: 'Report', icon: Plus, isAction: true },
  { href: '/evacuation', label: 'Shelters', icon: Home },
  { href: '/dashboard', label: 'Stats', icon: BarChart3 },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {bottomNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          if (link.isAction) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center -mt-4"
                aria-label={link.label}
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-blue-600 font-medium mt-1">{link.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 min-w-[3.5rem] rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label={link.label}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[10px] font-medium ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
