import { CSSProperties, RefObject, useEffect, useState } from "react";

export function useMarginPositioning(
  isOpen: boolean,
  buttonRef: RefObject<HTMLButtonElement>,
) {
  const toolTipWidth = 400;

  const tooltipPosition = {
    rightSide: {
      width: `${toolTipWidth}px`,
      marginLeft: `42px`,
      marginTop: `${-26}px`,
    },
    leftSide: {
      marginLeft: `${-toolTipWidth - 8}px`,
      width: `${toolTipWidth}px`,
      marginTop: `${-26}px`,
    },
  };

  const [positionStyle, setPositionStyle] = useState<CSSProperties | null>(
    null,
  );

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const isLeftSideLackingSpace = buttonRect.left - toolTipWidth < 0;

      setPositionStyle(
        isLeftSideLackingSpace
          ? tooltipPosition.rightSide
          : tooltipPosition.leftSide,
      );
    } else {
      setPositionStyle(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const button = {
    style: {},
  };

  const tooltip = {
    // do not display until first calculation in useEffect
    style: positionStyle || { display: "none" },
    className: [],
  };

  return { button, tooltip };
}
