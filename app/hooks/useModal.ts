import { useCallback, useState } from "react";

export const useModal = (): [boolean, () => void, () => void] => {
  const [active, setActive] = useState(false);

  const open = useCallback(() => {
    setActive(true);
  }, []);

  const close = useCallback(() => {
    setActive(false);
  }, []);

  return [active, open, close];
};
