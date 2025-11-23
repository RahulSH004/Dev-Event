'use client';

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AuthButton from './AuthButton'
import { useSession } from '@/lib/auth-client'
import Sidebar from './Sidebar'
import { Menu } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <header className="glass sticky top-0 z-50 h-[72px]">
        <nav className="relative flex items-center justify-between mx-auto container sm:px-10 px-5 py-4 h-full">
            {/* Left: Hamburger */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-light-100 hover:text-primary transition-colors p-1 rounded-md hover:bg-white/5"
                aria-label="Open Menu"
            >
                <Menu size={28} />
            </button>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link href="/" className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
                    <Image src="/icons/logo.png" alt="Logo" width={32} height={32} />
                </Link>
            </div>

            {/* Right: Auth/Profile */}
            <div className='flex justify-end'>
                <AuthButton />
            </div>
        </nav>

        <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            session={session}
        />
    </header>
  )
}

export default Navbar
