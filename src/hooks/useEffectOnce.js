import { useEffect } from "react";

const useEffectOnce = (callback = () => {}) => {
  useEffect(() => {
    let apiInvoked = true;
    apiInvoked && callback();
    return () => {
      apiInvoked = false;
    };
  }, []);
};

export default useEffectOnce;
