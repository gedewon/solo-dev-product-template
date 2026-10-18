# HTML report scaffold

> Rewritten for this template because the original file was missing. Replace it with the original if you find it.

One self-contained file. Tailwind and Mermaid load from CDN, everything else is inline.

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Architecture review: {repo name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'neutral' });
  </script>
</head>
<body class="bg-stone-50 text-stone-900">
  <main class="mx-auto max-w-5xl p-6 space-y-10">
    <header>
      <h1 class="text-3xl font-semibold">Architecture review</h1>
      <p class="text-stone-600">{date} · scope: {what you scanned and why}</p>
    </header>

    <!-- one <section> per candidate -->
    <section class="rounded-2xl border bg-white p-6 space-y-4">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-xl font-semibold">{candidate name, in CONTEXT.md vocabulary}</h2>
        <span class="rounded-full px-3 py-1 text-sm bg-emerald-100 text-emerald-800">Strong</span>
      </div>
      <dl class="grid gap-3 sm:grid-cols-2">
        <div><dt class="font-medium">Files</dt><dd>…</dd></div>
        <div><dt class="font-medium">Problem</dt><dd>…</dd></div>
        <div><dt class="font-medium">Solution</dt><dd>…</dd></div>
        <div><dt class="font-medium">Benefits</dt><dd>…</dd></div>
      </dl>
      <div class="grid gap-4 sm:grid-cols-2">
        <figure><figcaption class="text-sm text-stone-500">Before</figcaption><pre class="mermaid">…</pre></figure>
        <figure><figcaption class="text-sm text-stone-500">After</figcaption><pre class="mermaid">…</pre></figure>
      </div>
    </section>

    <section class="rounded-2xl border-2 border-stone-900 bg-white p-6">
      <h2 class="text-xl font-semibold">Top recommendation</h2>
      <p>…</p>
    </section>
  </main>
</body>
</html>
```

## Badges

| Strength | Classes |
|---|---|
| Strong | `bg-emerald-100 text-emerald-800` |
| Worth exploring | `bg-amber-100 text-amber-800` |
| Speculative | `bg-stone-200 text-stone-700` |

ADR conflict callout: `<div class="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-3">Contradicts ADR-0007, but worth reopening because …</div>`

## Diagram patterns

- **Shallow cluster, before.** A Mermaid `flowchart LR` where the caller fans out to many small modules, each a thin box. The fan-out is the point: it shows how much the caller has to know.
- **Deepened module, after.** The same caller with one arrow into a single box; the old modules drawn inside a `subgraph` labelled as the implementation.
- **Mass diagram.** Two stacked divs per module: interface height vs implementation height. Shallow modules show a tall interface bar over a short implementation bar.
- **Call sequence.** `sequenceDiagram` when the friction is ordering: the caller must call A, then B, then C in the right order.

Keep diagrams to what the card argues. One clear before/after beats a full dependency graph.
