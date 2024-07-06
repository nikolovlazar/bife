/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
import sortImports from '@trivago/prettier-plugin-sort-imports'
import tailwindCss from 'prettier-plugin-tailwindcss'

const config = {
  plugins: [sortImports],
  overrides: [
    {
      files: '*./tsx',
      options: {
        plugins: [
          sortImports,
          tailwindCss,
        ],
      },
    },
  ],
  arrowParens: 'always',
  bracketSpacing: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/lib/(.*)$',
    '^@/components/(.*)$',
    '^@/app/(.*)$',
    '^@/utils/(.*)$',
    '^../(.*)$',
    '^./(.*)$',
    '^.$',
  ],
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
