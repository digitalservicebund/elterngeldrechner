export function useAnchorPositioning() {
  const anchorIdentifier = `--dialog-button-${crypto.randomUUID()}`;

  const button = {
    style: { anchorName: anchorIdentifier },
  };

  const tooltip = {
    style: {
      positionAnchor: anchorIdentifier,
      width: "400px",
    },
    className: ["anchor-right-left", "anchor-top-top", "anchor-flip-inline"],
  };

  return { button, tooltip };
}
