import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to request a password reset email
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="link.keeper@example.com"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Send Reset Email
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Remembered it?{' '}
        <Link href="/signin" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
