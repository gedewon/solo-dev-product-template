export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-4 p-6">
      <h1 className="text-3xl font-semibold">It works.</h1>
      <p className="text-fg-muted">
        Start with <code>/grill-with-docs</code> to shape the first feature, or read{' '}
        <code>WORKFLOW.md</code> for how work moves through this repo.
      </p>
    </main>
  );
}
