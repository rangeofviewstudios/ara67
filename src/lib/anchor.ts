/** The on-page link target for a heading, such as "Post production" to "post-production". */
export function anchorFor(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
