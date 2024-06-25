'use client'

import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import type { Link } from '@/utils/types'

import { CreateLink } from '../../links/create-link'
import { addLinkToCollection, removeLinkFromCollection } from '../actions'

export function AddOrCreateLink({
  collectionFingerprint,
  userLinks = [],
  linksInCollection = [],
}: {
  collectionFingerprint: string
  userLinks: Link[]
  linksInCollection: Link[]
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" role="combobox" className="w-max">
          Add or create link
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-xs p-0">
        <Command
          filter={(value, search) => {
            const link = userLinks.find((link) => link.fingerprint === value)
            return link?.label?.toLowerCase().includes(search.toLowerCase()) ||
              link?.url.toLowerCase().includes(search.toLowerCase())
              ? 1
              : 0
          }}
        >
          <CommandInput placeholder="Search link..." className="h-9" />
          <CommandEmpty className="flex flex-col items-center gap-2 py-4">
            No links found
            <CreateLink
              className="cursor-pointer justify-start"
              collectionFingerprint={collectionFingerprint}
            />
          </CommandEmpty>
          <CommandList>
            {userLinks?.length > 0 && (
              <>
                <CommandGroup value={undefined}>
                  <CommandItem asChild>
                    <CreateLink
                      className="w-full cursor-pointer justify-start"
                      collectionFingerprint={collectionFingerprint}
                    />
                  </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Your links" value={undefined}>
                  {userLinks?.map((link) => {
                    const isInCollection = linksInCollection.some(
                      ({ fingerprint }) => link.fingerprint === fingerprint
                    )
                    return (
                      <CommandItem
                        key={link.url}
                        value={link.fingerprint}
                        onSelect={(currentValue) => {
                          if (currentValue) {
                            const data = {
                              linkFingerprint: currentValue,
                              fingerprint: collectionFingerprint,
                            }
                            if (isInCollection) {
                              removeLinkFromCollection(data)
                            } else {
                              addLinkToCollection(data)
                            }
                          }
                        }}
                        className="flex cursor-pointer gap-2"
                      >
                        <Check
                          className={cn(
                            'h-6 w-6',
                            isInCollection ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-sm font-semibold">
                            {link.label}
                          </span>
                          <span className="text-xs text-foreground/80">
                            {link.url}
                          </span>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
