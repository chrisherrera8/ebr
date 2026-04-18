import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, FileText, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface MainLayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function MainLayout({ sidebar, children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: '/', label: 'Chat', icon: MessageSquare },
    { href: '/documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="flex h-full bg-neutral-50">
      {/* Top nav bar for mobile */}
      <div className="fixed top-0 left-0 right-0 z-30 flex h-12 items-center border-b border-neutral-200 bg-white px-4 md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="h-8 w-8 p-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
        <span className="ml-3 text-sm font-semibold text-neutral-900">
          PDF Chat
        </span>

        <nav className="ml-auto flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                location.pathname === href
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      {sidebar && (
        <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-neutral-200 bg-white">
          {/* Logo / nav */}
          <div className="flex h-12 items-center border-b border-neutral-200 px-4">
            <span className="text-sm font-semibold text-neutral-900">
              PDF Chat
            </span>
            <nav className="ml-auto flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                    location.pathname === href
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1 overflow-hidden">{sidebar}</div>
        </aside>
      )}

      {/* Mobile sidebar overlay */}
      {sidebar && mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed left-0 top-12 bottom-0 z-20 w-72 flex flex-col border-r border-neutral-200 bg-white md:hidden overflow-hidden">
            {sidebar}
          </aside>
        </>
      )}

      {/* Main content */}
      <main
        className={cn(
          'flex flex-1 flex-col overflow-hidden',
          'md:pt-0 pt-12',
        )}
      >
        {children}
      </main>
    </div>
  );
}
