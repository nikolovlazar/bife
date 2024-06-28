'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Turnstile, { useTurnstile } from 'react-turnstile'
import { z } from 'zod'

import { Button } from '@/app/_components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form'
import { Input } from '@/app/_components/ui/input'
import { signUpInputSchema } from '@/app/_lib/validation-schemas/auth'

import { signUp } from '../actions'

export const SignUpForm = () => {
  const [tsToken, setTsToken] = useState<string | undefined>()
  const turnstile = useTurnstile()

  const form = useForm<z.infer<typeof signUpInputSchema>>({
    resolver: zodResolver(signUpInputSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof signUpInputSchema>) {
    const data = new FormData()
    data.append('email', values.email)
    data.append('password', values.password)
    data.append('confirmPassword', values.confirmPassword)
    data.append('tsToken', tsToken!)

    const [output] = await signUp(data)
    if (output && output.errors) {
      turnstile.reset()
      output.errors.email &&
        form.setError('email', { message: output.errors.email })
      output.errors.password &&
        form.setError('password', { message: output.errors.password })
      output.errors.confirmPassword &&
        form.setError('confirmPassword', {
          message: output.errors.confirmPassword,
        })
    }
  }
  return (
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="password12345"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="password12345"
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
          <Button type="submit" className="w-full" disabled={!tsToken}>
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  )
}
