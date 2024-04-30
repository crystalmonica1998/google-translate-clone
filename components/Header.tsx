import { SignInButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function Header() {
    const { userId } = auth();

    const url = `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.VERCEL_URL}/translate`;

    console.log('env: ', process.env.NODE_ENV);
    console.log('url: ', url);

  return (
    <header className='flex items-center justify-between px-8 mb-5'>
        <div className='flex items-center h-20 overflow-hidden'>
            <Link href='/'>
                <Image
                    src='https://links.papareact.com/xgu'
                    alt='logo'
                    width={200}
                    height={100}
                    className='object-contain h-32 cursor-pointer'
                />
            </Link>
        </div>

        {userId ? (
            <div>
                <UserButton />
            </div>
        ): (
            <SignInButton fallbackRedirectUrl={url} mode='modal' />
        )}
    </header>
  )
}

export default Header