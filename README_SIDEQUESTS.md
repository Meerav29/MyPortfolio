# Sidequests Section

This directory describes how to add and preview Sidequest posts.

## Adding a Post

1. Place an `.mdx` file inside `content/sidequests/`.
2. Include the frontmatter:

```yaml
---
title: "Post title"
publishedAt: "2025-01-01"
excerpt: "Short teaser"
tags: ["Tag A", "Tag B"]
thumbnail: "/images/sidequests/example.png"
status: "published"
---
```

* `slug` is optional; when missing it is derived from the filename.
* `readingTime` is computed automatically.
* Tags will be normalized to Title Case.

3. Add any referenced thumbnail under `public/images/sidequests/`.

## Previewing

Run the development server and visit `/sidequests` to see listings or `/sidequests/<slug>` for an individual post.

## Notes

* Only posts with `status: published` appear on the public listing.
* The RSS feed is available at `/sidequests.xml`.
* Tags can be combined with `?tag=Foo&tag=Bar` and searched with `?q=term`.
