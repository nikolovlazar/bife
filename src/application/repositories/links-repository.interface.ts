import { Link, LinkInsert, LinkUpdate } from '@/entities/models/link'

export interface ILinksRepository {
  getLink(fingerprint: string): Promise<Link>

  getLinksForUser(userId: string): Promise<Link[]>

  createLink(link: LinkInsert, userId: string): Promise<Link>

  updateLink(fingerprint: string, link: LinkUpdate): Promise<Link>

  deleteLink(fingerprint: string): Promise<void>
}
