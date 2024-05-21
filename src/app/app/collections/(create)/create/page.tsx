import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import CreateCollectionForm from '../create-collection-form'

export default function CreateCollection() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a new collection</CardTitle>
          <CardDescription>
            Collections are shareable lists of links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCollectionForm />
        </CardContent>
      </Card>
    </div>
  )
}
