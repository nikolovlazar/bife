import { LinkIcon, Menu, Utensils } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, Suspense } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { SidebarLink } from './sidebar-link'
import { SignOut } from './signout'
import { ThemeSwitcher } from './theme-switcher'
import { UserAvatar } from './user-avatar'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/app" className="flex items-center gap-2 font-semibold">
              <Utensils className="h-6 w-6" />
              <span className="">Bife</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 pt-2 text-sm font-medium lg:px-4">
              <SidebarLink
                href="/app/collections"
                className="flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:text-primary"
              >
                <LinkIcon className="h-5 w-5" />
                Collections
              </SidebarLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 md:flex-row-reverse lg:h-[60px] lg:px-6">
          {/* Mobile sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <SidebarLink
                  href="/app"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Utensils className="h-6 w-6" />
                  <span className="">Bife</span>
                </SidebarLink>
                <SidebarLink
                  href="/app/collections"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LinkIcon className="h-5 w-5" />
                  Collections
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
        </header>
        <main className="flex flex-1 flex-col p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
