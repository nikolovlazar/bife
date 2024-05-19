import { type LucideIcon, type LucideProps } from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  github: (props: LucideProps) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  google: (props: LucideProps) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4799 10.92V14.2H20.3199C20.0799 16.04 19.4669 17.387 18.5329 18.333C17.3859 19.48 15.5999 20.733 12.4799 20.733C7.65288 20.733 3.87988 16.84 3.87988 12.013C3.87988 7.186 7.65288 3.293 12.4799 3.293C15.0799 3.293 16.9869 4.32 18.3869 5.64L20.6939 3.333C18.7469 1.44 16.1329 0 12.4799 0C5.86688 0 0.306885 5.387 0.306885 12C0.306885 18.613 5.86688 24 12.4799 24C16.0529 24 18.7469 22.827 20.8529 20.64C23.0129 18.48 23.6929 15.427 23.6929 12.973C23.6929 12.213 23.6399 11.506 23.5199 10.92H12.4799Z"
        fill="currentColor"
      />
    </svg>
  ),
}
