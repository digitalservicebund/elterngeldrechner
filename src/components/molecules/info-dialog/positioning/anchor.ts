export function useAnchorPositioning() {
  const anchorIdentifier = `--dialog-button-${Math.floor(Math.random() * 1000000)}`;

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
