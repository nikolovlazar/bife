import { CircleUser, User } from 'lucide-react'

import { getUserController } from '@/interface-adapters/controllers/get-user.controller'
import { SetSentryUser } from '@/web/_components/custom/set-sentry-user'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/web/_components/ui/avatar'

export async function UserAvatar() {
  let user: { id: string; email?: string; user_metadata: any } | undefined
  try {
    user = await getUserController()
  } catch (err) {}

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
