import { Utensils } from 'lucide-react'
import NextLink from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { createClient } from '@/utils/supabase/server'

export default async function PublicCollectionPage({
  params,
}: {
  params: { fingerprint: string }
}) {
  const supabase = createClient()
  const { data: collection } = await supabase
    .from('collection')
    .select('*')
    .eq('fingerprint', params.fingerprint)
    .single()

  if (!collection) {
    const { data: link, error: linkError } = await supabase
      .from('link')
      .select('url')
      .eq('fingerprint', params.fingerprint)
      .single()

    if (linkError) {
      throw linkError
    }
    if (!link) {
      return notFound()
    }

    permanentRedirect(link.url)
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: links, error: linksError } = await supabase
      .from('collection_link')
      .select('visible, order, link(*)')
      .order('order', { ascending: true })
      .eq('collection_pk', collection.fingerprint)

    if (linksError) {
      console.error(linksError)
      return <p>Error loading links.</p>
    }

    const canSeeHiddenLinks = user && collection.created_by === user.id

    const displayedLinks = links
      .filter((link) => link.visible || canSeeHiddenLinks)
      .map((link) => ({ ...link.link, visible: true }))

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>{collection.title}</CardTitle>
            <CardDescription>{collection.description}</CardDescription>
          </CardHeader>
        </Card>
        <div className="flex flex-1 flex-col justify-between gap-8">
          <div className="flex flex-1 flex-col gap-4">
            {displayedLinks.map((link) => (
              <a
                key={link.fingerprint}
                href={link.url}
                target="_blank"
                rel="noopener nofollow"
                className="group flex flex-row items-center justify-between gap-2 overflow-hidden rounded-sm bg-background px-4 py-2 font-semibold shadow max-md:flex-col max-md:items-start md:gap-4"
              >
                <div className="flex gap-4">
                  <span>🔗</span>
                  <span className="shrink-0">{link.label}</span>
                </div>
                <span className="w-max max-w-full truncate text-xs font-normal text-muted-foreground group-hover:text-purple-500">
                  {link.url}
                </span>
              </a>
            ))}
          </div>
          <NextLink
            href="/"
            className="flex w-max self-center rounded-md bg-background px-3 py-2 shadow"
          >
            <Utensils className="mr-1" />
            Create your own Bife collection
          </NextLink>
        </div>
      </>
    )
  }
}
