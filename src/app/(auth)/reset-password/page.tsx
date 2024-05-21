import { ResetPasswordForm } from './form'

export default function ResetPassword() {
  return (
    <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your new password
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  )
}
