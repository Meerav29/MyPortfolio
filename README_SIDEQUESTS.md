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

## Substack posts

* Posts from https://meeravshah.substack.com/feed are merged into the listing automatically at build time (cached for an hour). They link out to Substack in a new tab and have no page on this site. If the feed is unreachable, only local posts are shown.
* To feature a Substack post by hand (e.g. with a custom thumbnail or tags), add an `.mdx` with `externalUrl: "https://..."` in the frontmatter. It replaces the feed's copy of the same URL, links out, and `/sidequests/<slug>` returns 404.

## Previewing

Run the development server and visit `/sidequests` to see listings or `/sidequests/<slug>` for an individual post.

## Notes

* Only posts with `status: published` appear on the public listing.
* The RSS feed is available at `/sidequests.xml`.
* Tags can be combined with `?tag=Foo&tag=Bar` and searched with `?q=term`.
