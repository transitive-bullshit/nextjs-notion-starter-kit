import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Search } from 'react-notion-x'

const isSearchEnabled = true

function Header({ block }) {
  return (
    <header className='top-0 p-5 bg-pink-700 w-full z-50 text-white'>
      <div className='space-x-4 flex justify-between items-center max-w-7xl mx-auto'>
        <div className='flex space-x-2'>
          <Link href={'/'}>
            <Image
              src={'/../public/logo.png'}
              alt={'logo'}
              width={50}
              height={50}
              className='m-auto cursor-pointer hover:scale-90 transition-transform ease-linear active:scale-85'
            />
          </Link>
          <h1>Talking Points</h1>
        </div>

        {isSearchEnabled && <Search block={block} title={null} />}

        <button className='space-x-2 z-10'>
          <Link
            href={'/'}
            className='px-2 py-1 bg-white text-pink-700 rounded-lg hover:bg-pink-500 hover:text-white hover:scale-105'
          >
            Login
          </Link>
        </button>
      </div>
    </header>
  )
}

export default Header
