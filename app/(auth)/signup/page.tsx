import Link from 'next/link'

import { signInWithProvider } from '../actions'

import { SignUpForm } from './form'
import { Button } from '@/web/_components/ui/button'
import { Icons } from '@/web/_components/ui/icons'
import { Separator } from '@/web/_components/ui/separator'

export default function SignUp() {
  return (
    <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
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
      <SignUpForm />
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/signin" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
