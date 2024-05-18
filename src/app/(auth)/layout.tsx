import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center py-12">
      {children}
    </div>
  )
}
