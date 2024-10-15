import { Link, LinkInsert, LinkUpdate } from '@/entities/models/link'

export interface ILinksRepository {
  getLink(fingerprint: string): Promise<Link>

  getLinksForUser(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ links: Link[]; totalCount: number }>

  createLink(
    link: LinkInsert,
    userId: string,
    fingerprint: string
  ): Promise<Link>

  updateLink(fingerprint: string, input: LinkUpdate): Promise<Link>

  deleteLink(fingerprint: string): Promise<void>
}
