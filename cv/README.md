# CV source

Edit [`seifeldin-swe-cv.md`](./seifeldin-swe-cv.md) to update the CV. The PDF at
`public/assets/documents/seifeldin-swe-cv.pdf` is generated from that Markdown
source and should not be edited directly.

Render the PDF locally with:

```bash
pnpm cv:build
```

`pnpm build` also renders the CV before building the portfolio, so deployments
always publish the latest Markdown version.
