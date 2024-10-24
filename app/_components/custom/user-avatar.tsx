import { CircleUser, User } from 'lucide-react'

import { createClient } from '@/infrastructure/utils/supabase/server'

import { SetSentryUser } from '@/web/_components/custom/set-sentry-user'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/web/_components/ui/avatar'

export async function UserAvatar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (
    <Avatar>
      <AvatarImage src={user.user_metadata['avatar_url']} />
      <AvatarFallback>
        {user.user_metadata['name']?.split(' ').map((w: string) => w[0]) ?? (
          <User />
        )}
        <SetSentryUser email={user.email} />
      </AvatarFallback>
    </Avatar>
  ) : (
    <CircleUser className="h-5 w-5" />
  )
}
