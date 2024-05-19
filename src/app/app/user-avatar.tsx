import { CircleUser } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { createClient } from '@/utils/supabase/server'

export async function UserAvatar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (
    <Avatar>
      <AvatarImage src={user.user_metadata['avatar_url']} />
      <AvatarFallback>
        {user.user_metadata['name'].split(' ').map((w: string) => w[0])}
      </AvatarFallback>
    </Avatar>
  ) : (
    <CircleUser className="h-5 w-5" />
  )
}
