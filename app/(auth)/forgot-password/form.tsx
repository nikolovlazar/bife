'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCheck, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Turnstile, { useTurnstile } from 'react-turnstile'
import { toast } from 'sonner'
import { z } from 'zod'

import { forgotPassword } from '../actions'

import { Button } from '@/web/_components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/web/_components/ui/form'
import { Input } from '@/web/_components/ui/input'
import { forgotPasswordInputSchema } from '@/web/_lib/validation-schemas/auth'

export const ForgotPasswordForm = () => {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tsToken, setTsToken] = useState<string | undefined>()
  const turnstile = useTurnstile()

  const form = useForm<z.infer<typeof forgotPasswordInputSchema>>({
    resolver: zodResolver(forgotPasswordInputSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof forgotPasswordInputSchema>) {
    const data = new FormData()
    data.append('email', values.email)
    data.append('tsToken', tsToken!)
    setLoading(true)
    const res = await forgotPassword(data)
    console.log(res)
    // if (res.errors) {
    //   res.errors.email && form.setError('email', { message: res.errors.email })
    //   turnstile.reset()
    // } else if (res.success) {
    //   setSent(true)
    //   toast.success(res.message, {
    //     description: 'Check your email for further instructions',
    //   })
    // }
  }

  return !sent ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="bife@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Verify you&apos;re human</FormLabel>
            <FormControl>
              <Turnstile
                sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                className="mx-auto"
                onVerify={setTsToken}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <input className="hidden" name="tsToken" value={tsToken} />
          <Button
            type="submit"
            className="w-full"
            disabled={!tsToken || loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              'Request Password Reset'
            )}
          </Button>
        </div>
      </form>
    </Form>
  ) : (
    <div className="flex flex-col items-center gap-y-2">
      <CheckCheck className="h-14 w-14 animate-bounce text-green-500" />
      <h2>Password reset requested! Check your email!</h2>
    </div>
  )
}