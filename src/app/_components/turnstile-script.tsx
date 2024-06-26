import Script from 'next/script'

export const TurnstileScript = () => {
  return (
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      async={true}
      defer={true}
    />
  )
}
