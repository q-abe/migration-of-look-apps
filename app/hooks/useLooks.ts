import type {
  Dispatch,
  SetStateAction} from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LookAPI } from '~/api/LookAPI';

import { useAuthenticatedAPI } from "./useAuthenticatedAPI";
import { useMountedState } from "./useMountedState";

class LookCard {
}

type Option = {
  initialLooks?: LookCard[];
  excludeLooks?: LookCard[];
};

/**
 * ルック情報の一覧を取得して返します。
 * @param option
 * @returns ルック情報一覧
 */
export const useLooks = (
  option?: Option
): [
  LookCard[],
  Dispatch<SetStateAction<LookCard[]>>,
  number | undefined,
  Dispatch<SetStateAction<number | undefined>>,
  (look: LookCard) => Promise<void>
] => {
  const { isMounted } = useMountedState();
  const [looks, setLooks] = useState<LookCard[]>([]);
  const lookAPI = useAuthenticatedAPI(LookAPI);

  // 編集中のLook情報
  const [editingLookId, setEditingLookId] = useState<number>();

  useEffect(() => {
    if (option?.initialLooks) {
      setLooks(option.initialLooks);
      return;
    }
    (async () => {
      const looks = await lookAPI.getAll();
      if (isMounted()) {
        setLooks(looks.map((look) => ({ ...look, isSelected: false })));
      }
    })();
  }, [option]);

  // excludeLooksで指定されたルックを除いたルック一覧
  const filteredLooks = useMemo(() => {
    if (typeof option?.excludeLooks === "undefined") return looks;

    return looks.filter((look) =>
      option.excludeLooks!.every((excludeLook) => look.id !== excludeLook.id)
    );
  }, [looks, option]);

  const updateLook = useCallback(async (look: LookCard) => {
    const updatedLook = await lookAPI.update(look.id, look);
    setLooks((looks) => {
      const newLooks = [...looks];
      const targetIndex = newLooks.findIndex(
        (newLook) => newLook.id === updatedLook.id
      );
      if (targetIndex === -1) return looks;
      newLooks[targetIndex] = Object.assign(
        {},
        newLooks[targetIndex],
        updatedLook
      );
      return newLooks;
    });
  }, []);

  return [filteredLooks, setLooks, editingLookId, setEditingLookId, updateLook];
};
