import { Link, LinkInsert, LinkUpdate } from '@/entities/models/link'

export interface ILinksRepository {
  getLink(fingerprint: string): Promise<Link>

  getLinksForUser(userId: string): Promise<Link[]>

  createLink(
    link: LinkInsert,
    userId: string,
    fingerprint: string
  ): Promise<Link>

  updateLink(fingerprint: string, input: LinkUpdate): Promise<Link>

  deleteLink(fingerprint: string): Promise<void>
}
