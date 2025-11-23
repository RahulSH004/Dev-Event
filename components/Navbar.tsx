'use client';

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AuthButton from './AuthButton'
import { useSession } from '@/lib/auth-client'

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <header>
        <nav>
            <Link href="/" className='logo'>
                <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
            </Link>
            <ul className='nav-center'>
                <Link href="/">Home</Link>
                <Link href="/events">Events</Link>
                {session && (
                    <>
                        <Link href="/dashboard">My Events</Link>
                        <Link href="/admin/events">Manage Events</Link>
                        <Link href="/admin/analytics">Analytics</Link>
                    </>
                )}
            </ul>
            <div className='nav-right'>
                <AuthButton />
            </div>
        </nav>
    </header>
  )
}

export default Navbar
