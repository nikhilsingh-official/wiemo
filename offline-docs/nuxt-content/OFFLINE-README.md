# Offline Nuxt Content and Studio Docs

This folder is a local copy of the official Nuxt Content docs source from:

https://github.com/nuxt/content/tree/main/docs/content/docs

Downloaded from commit `dc90e96` on 2026-08-05.

It includes the Nuxt Content docs. Nuxt Studio docs are copied separately under
`offline-docs/nuxt-studio`.

## Search

From the project root:

```bash
rg "queryCollection" offline-docs/nuxt-content
rg "defineCollection" offline-docs/nuxt-content
rg "content.config" offline-docs/nuxt-content
```

The files are Markdown and YAML source files from the docs site, so they can be read directly in an editor without a dev server.
