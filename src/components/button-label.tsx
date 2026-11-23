/** A button's text, doubled so it can roll to a second copy on hover. Screen readers hear it once. */
export function ButtonLabel({ children }: { children: string }) {
  return (
    <span className="btn-roll" data-label={children}>
      <span>{children}</span>
    </span>
  );
}
