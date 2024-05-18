import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// TODO: Ensure that `code` is present in query and it matches a user, otherwise redirect

export default function Signin() {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <Link
          href="/"
          className="relative mb-12 bg-opacity-50 text-4xl font-bold text-foreground"
        >
          <h1>Bife 🍴</h1>
        </Link>
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your new password to reset it
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input id="new-password" type="password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-new-password">Confirm New Password</Label>
        <Input id="confirm-new-password" type="password" required />
      </div>
      <Button type="submit" className="w-full">
        Reset Password
      </Button>
    </div>
  )
}
