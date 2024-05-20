import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit'
import { Switch } from '@/components/ui/switch'

import { DeleteCollectionButton } from './delete-collection-button'
import { createClient } from '@/utils/supabase/server'

import { updateCollection } from '../actions'

export default async function CollectionDetails({
  params,
}: {
  params: { fingerprint: string }
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('link_collection')
    .select('*')
    .eq('fingerprint', params.fingerprint)
    .single()
  if (error) {
    console.error(error)
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Edit {data?.title}
        </h1>
      </div>
      <div className="flex flex-col xl:flex-row gap-4">
        <form action={updateCollection} className="mt-4 w-full xl:max-w-lg">
          <fieldset className="grid gap-4 rounded-lg border p-4 items-start">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Collection details
            </legend>
            <div className="gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="ReactConf 2024"
                defaultValue={data?.title}
              />
            </div>
            <div className="gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder=""
                defaultValue={data?.description ?? ''}
              />
            </div>
            <div className="flex gap-1.5 items-center">
              <Checkbox
                name="published"
                id="published"
                defaultChecked={data?.published}
                className="w-6 h-6"
              />
              <Label htmlFor="published">Published</Label>
            </div>
            <input
              name="fingerprint"
              readOnly
              type="text"
              hidden
              aria-hidden
              aria-readonly
              value={params.fingerprint}
              className="hidden"
            />
            <SubmitButton>Update</SubmitButton>
            <DeleteCollectionButton fingerprint={params.fingerprint} />
          </fieldset>
        </form>
        <form className="mt-4 flex-1">
          <fieldset className="grid gap-4 rounded-lg border p-4 items-start">
            <legend className="-ml-1 px-1 text-sm font-medium">Links</legend>
            {/* TODO: display links here */}
          </fieldset>
        </form>
      </div>
    </>
  )
}
