import React from 'react'
import Link from 'next/link'

const Logo = ({ className }) => {
  return (
    <Link href="/home">
      <a className={`flex items-center ${className}`}>
        <div className="h-[30px] w-[30px] rounded-full bg-primary mr-3" />
        <div className="text-xl font-bold">Ô tô Viêt Hưng</div>
      </a>
    </Link>
  )
}

export default Logo
