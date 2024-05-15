import { ReactElement, useEffect, useState } from "react";
import nsp from "@/globals/js/namespace";

export const Spinner = (): ReactElement => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return <>{show && <div className={nsp("spinner")}></div>}</>;
};
