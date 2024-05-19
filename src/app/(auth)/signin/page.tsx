import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Separator } from '@/components/ui/separator'

import { SignInForm } from './form'

import { signin } from '../actions'

export default function SignIn() {
  return (
    <div className="mx-auto flex flex-col justify-center w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to sign in to your account
        </p>
      </div>
      <form action={signin}>
        <div className="grid gap-4">
          <Button
            variant="outline"
            className="w-full"
            name="provider"
            value="google"
            type="submit"
          >
            Continue with Google
            <Icons.google className="w-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            className="w-full"
            name="provider"
            value="github"
            type="submit"
          >
            Continue with GitHub
            <Icons.github className="w-5 ml-2" />
          </Button>
        </div>
      </form>
      <div className="flex items-center gap-4">
        <Separator className="shrink" />
        OR
        <Separator className="shrink" />
      </div>
      <SignInForm />
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
