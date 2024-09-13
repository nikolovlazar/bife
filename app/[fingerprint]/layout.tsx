export default function PublicCollectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="min-h-screen w-screen px-12">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 py-8">
        {children}
      </div>
    </main>
  )
}
