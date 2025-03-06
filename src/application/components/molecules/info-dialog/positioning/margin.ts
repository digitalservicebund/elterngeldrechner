import { CSSProperties, RefObject, useLayoutEffect, useState } from "react";

export function useMarginPositioning(
  isOpen: boolean,
  buttonRef: RefObject<HTMLButtonElement>,
) {
  const toolTipWidth = 400;

  const position = {
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

  const [positionStyle, setPositionStyle] = useState<CSSProperties>(
    position.leftSide,
  );

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const isLeftSideLackingSpace = buttonRect.left - toolTipWidth < 0;

      setPositionStyle(
        isLeftSideLackingSpace ? position.rightSide : position.leftSide,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const button = {
    style: {},
  };

  const tooltip = {
    style: positionStyle,
    className: [],
  };

  return { button, tooltip };
}
