export default function PublicCollectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="bg-muted w-screen min-h-screen">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto py-8 min-h-screen">
        {children}
      </div>
    </main>
  )
}
