import { Link, LinkInsert, LinkUpdate } from '@/entities/models/link'

export interface ILinksRepository {
  getLink(fingerprint: string): Promise<Link>

  createLink(link: LinkInsert, userId: string): Promise<Link>

  updateLink(fingerprint: string, link: LinkUpdate): Promise<Link>

  deleteLink(fingerprint: string): Promise<void>

  setLinkVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ): Promise<Link>
}
