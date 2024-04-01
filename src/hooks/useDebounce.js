import { useEffect, useRef } from "react";
let t;
const useDebounce = (callBack, delay = 500, dependencies) => {
  let ref = useRef(false);
  useEffect(() => {
    if (ref.current) {
      clearTimeout(t);
      t = setTimeout(callBack, delay);
    } else ref.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependencies]);
};

export default useDebounce;
