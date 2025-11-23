'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
}

export default function Sidebar({ isOpen, onClose, session }: SidebarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-dark-100 border-r border-border-dark z-[100] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b border-border-dark">
          <h2 className="text-xl font-bold text-white font-schibsted-grotesk">Menu</h2>
          <button 
            onClick={onClose} 
            className="text-light-100 hover:text-primary transition-colors p-1 rounded-md hover:bg-white/5"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col p-5 gap-2 opacity-100">
          <Link 
            href="/" 
            className="text-light-100 hover:text-primary hover:bg-white/5 px-4 py-3 rounded-lg text-lg transition-all font-medium" 
            onClick={onClose}
          >
            Home
          </Link>
          <Link 
            href="/events" 
            className="text-light-100 hover:text-primary hover:bg-white/5 px-4 py-3 rounded-lg text-lg transition-all font-medium" 
            onClick={onClose}
          >
            Events
          </Link>

          {session ? (
            <>
              <Link 
                href="/dashboard" 
                className="text-light-100 hover:text-primary hover:bg-white/5 px-4 py-3 rounded-lg text-lg transition-all font-medium" 
                onClick={onClose}
              >
                My Events
              </Link>
              <Link 
                href="/admin/events" 
                className="text-light-100 hover:text-primary hover:bg-white/5 px-4 py-3 rounded-lg text-lg transition-all font-medium" 
                onClick={onClose}
              >
                Manage Events
              </Link>
              <Link 
                href="/admin/analytics" 
                className="text-light-100 hover:text-primary hover:bg-white/5 px-4 py-3 rounded-lg text-lg transition-all font-medium" 
                onClick={onClose}
              >
                Analytics
              </Link>
              
              <div className="mt-4 pt-4 border-t border-border-dark">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-light-100 hover:text-destructive hover:bg-destructive/10 px-4 py-3 rounded-lg text-lg transition-all font-medium"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
             <div className="mt-4 pt-4 border-t border-border-dark">
                <Link 
                    href="/auth/signin" 
                    className="block text-light-100 hover:text-primary hover:bg-white/5 px-4 py-3 rounded-lg text-lg transition-all font-medium" 
                    onClick={onClose}
                >
                    Sign In
                </Link>
             </div>
          )}
        </nav>
      </div>
    </>
  );
}
