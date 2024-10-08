'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Turnstile, { useTurnstile } from 'react-turnstile'
import { z } from 'zod'

import { signInWithPassword } from '../actions'

import { signInWithPasswordFormSchema } from '@/interface-adapters/validation-schemas/auth'
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

export const SignInForm = () => {
  const [tsToken, setTsToken] = useState<string | undefined>()
  const turnstile = useTurnstile()

  const form = useForm<z.infer<typeof signInWithPasswordFormSchema>>({
    resolver: zodResolver(signInWithPasswordFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(
    values: z.infer<typeof signInWithPasswordFormSchema>
  ) {
    try {
      await signInWithPassword({
        email: values.email,
        password: values.password,
        tsToken: tsToken!,
      })
    } catch (err) {
      if (err instanceof Error) {
        turnstile.reset()
        form.setError('password', { message: err.message })
        form.setError('email', { message: err.message })
      }
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
                    autoComplete="email"
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
                <FormLabel>
                  <div className="flex items-center">
                    Password
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm text-foreground underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </FormLabel>
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
            <p>Verify you&apos;re human</p>
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
              className="mx-auto"
              onVerify={setTsToken}
            />
            <FormMessage />
          </FormItem>
          <Button type="submit" className="w-full" disabled={!tsToken}>
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  )
}
