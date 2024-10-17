import { Menu } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, Suspense } from 'react'

import { SidebarLink } from './sidebar-link'
import { SignOut } from './signout'
import { ThemeSwitcher } from './theme-switcher'
import { UserAvatar } from '@/web/_components/custom/user-avatar'
import UserFeedbackWidget from '@/web/_components/custom/user-feedback-widget'
import { Button } from '@/web/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/web/_components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/web/_components/ui/sheet'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col overflow-hidden">
        <UserFeedbackWidget />
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 sm:flex-row-reverse lg:h-[60px] lg:px-6">
          {/* Mobile sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 sm:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-4 text-lg font-medium">
                <SidebarLink
                  href="/app"
                  className="flex items-center text-2xl font-semibold"
                >
                  <span className="">Bife</span>
                </SidebarLink>
                <SidebarLink
                  href="/app/collections"
                  className="mx-[-0.65rem] px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Collections
                </SidebarLink>
                <SidebarLink
                  href="/app/links"
                  className="mx-[-0.65rem] px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Links
                </SidebarLink>
              </nav>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="justify-self-end rounded-full"
              >
                <Suspense fallback={<span>...</span>}>
                  <UserAvatar />
                </Suspense>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <ThemeSwitcher />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <SignOut />
            </DropdownMenuContent>
          </DropdownMenu>
          <nav className="flex items-center gap-8 max-sm:hidden">
            <h1 className="text-xl font-semibold">Bife</h1>
            <ul className="flex gap-4">
              <li>
                <Link href="/app/collections">Collections</Link>
              </li>
              <li>
                <Link href="/app/links">Links</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex flex-1 flex-col p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
