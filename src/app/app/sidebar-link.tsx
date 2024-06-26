'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

import { cn } from '@/app/_lib/utils'

export const SidebarLink = ({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) => {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      data-current={pathname === href}
      className={cn(
        className,
        'data-[current=true]:bg-muted data-[current=true]:text-foreground'
      )}
    >
      {children}
    </Link>
  )
}
