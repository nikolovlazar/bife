import Link from 'next/link'

import { ForgotPasswordForm } from './form'

export default function ForgotPassword() {
  return (
    <div className="mx-auto flex flex-col justify-center w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email to receive a link to reset your password
        </p>
      </div>
      <ForgotPasswordForm />
      <div className="mt-4 text-center text-sm">
        You just remembered it?{' '}
        <Link href="/signin" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
