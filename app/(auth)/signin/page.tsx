import Link from 'next/link'

import { signInWithProvider } from '../actions'

import { SignInForm } from './form'
import { Button } from '@/web/_components/ui/button'
import { Icons } from '@/web/_components/ui/icons'
import { Separator } from '@/web/_components/ui/separator'

export default function SignIn() {
  return (
    <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to sign in to your account
        </p>
      </div>
      <form action={signInWithProvider}>
        <div className="grid gap-4">
          <Button
            variant="outline"
            className="w-full"
            name="provider"
            value="google"
            type="submit"
          >
            Continue with Google
            <Icons.google className="ml-2 w-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full"
            name="provider"
            value="github"
            type="submit"
          >
            Continue with GitHub
            <Icons.github className="ml-2 w-5" />
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
