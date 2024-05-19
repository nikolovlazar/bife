type Return = {
  success: boolean
  response?: Response
}

export default async function checkTurnstileToken(
  token?: string
): Promise<Return> {
  if (!token) {
    return {
      success: false,
      response: Response.json(
        {
          errors: {
            email:
              'Missing Turnstile token. Contact hello@nikolovlazar.com for help.',
          },
        },
        { status: 400 }
      ),
    }
  }

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

  const formData = new FormData()
  formData.append('secret', process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '')
  formData.append('response', token)

  let outcome: { success: boolean } = { success: false }
  try {
    const result = await fetch(url, {
      body: formData,
      method: 'POST',
    })

    outcome = (await result.json()) as { success: boolean }
  } catch (err) {
    console.error(err)
  } finally {
    if (outcome.success) {
      return { success: true }
    }

    return {
      success: false,
      response: Response.json(
        {
          errors: {
            email:
              'Could not validate Turnstile token. Contact hello@nikolovlazar.com for help.',
          },
        },
        { status: 400 }
      ),
    }
  }
}
