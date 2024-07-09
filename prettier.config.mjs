/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  arrowParens: 'always',
  bracketSpacing: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/lib/(.*)$',
    '^@/components/(.*)$',
    '^@/app/(.*)$',
    '^@/application/(.*)$',
    '^@/entities/(.*)$',
    '^@/infrastructure/(.*)$',
    '^@/utils/(.*)$',
    '^../(.*)$',
    '^./(.*)$',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  printWidth: 80,
  singleQuote: true,
  proseWrap: 'always',
}

export default config
