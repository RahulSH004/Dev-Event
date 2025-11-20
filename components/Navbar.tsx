import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AuthButton from './AuthButton'

const Navbar = () => {
  return (
    <header>
        <nav>
            <Link href="/" className='logo'>
                <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
            </Link>
            <ul className='nav-center'>
                <Link href="/">Home</Link>
                <Link href="/events">Events</Link>
                <Link href="/admin/events">Manage Events</Link>
            </ul>
            <div className='nav-right'>
                <AuthButton />
            </div>
        </nav>
    </header>
  )
}

export default Navbar
