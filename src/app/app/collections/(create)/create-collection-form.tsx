import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit'

import { createCollection } from '../actions'

export default function CreateCollectionForm() {
  return (
    <form
      className="grid w-full gap-3 max-w-sm items-center"
      action={createCollection}
    >
      <div className="gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="ReactConf 2024"
        />
      </div>
      <div className="gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" type="text" placeholder="" />
      </div>
      <SubmitButton className="mt-4" type="submit">
        Create
      </SubmitButton>
    </form>
  )
}
