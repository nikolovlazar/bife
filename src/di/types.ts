export const DI_TYPES = {
  // Services
  AuthenticationService: Symbol.for('AuthenticationService'),

  // Repositories
  CollectionsRepository: Symbol.for('CollectionsRepository'),
  CollectionLinkRepository: Symbol.for('CollectionLinkRepository'),
  LinksRepository: Symbol.for('LinksRepository'),

  // Use cases
  CollectionsUseCases: Symbol.for('CollectionsUseCases'),
  CollectionLinkUseCases: Symbol.for('CollectionLinkUseCases'),
  LinksUseCases: Symbol.for('LinksUseCases'),
}
