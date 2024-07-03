import type { Dispatch, SetStateAction} from "react";
import { useCallback, useMemo } from "react";
import { LookAPI } from '~/api/LookAPI';

import { useAuthenticatedAPI } from "./useAuthenticatedAPI";

/**
 * 共通で使用するボタン操作を管理するフック
 */
export const useButtonAction = (
  looks: LookCard[],
  setLooks: Dispatch<SetStateAction<LookCard[]>>
) => {
  /** 全て選択ボタン */
  const isSelectedAll = useMemo(
    () => looks.length > 0 && looks.every((look) => look.isSelected),
    [looks]
  );

  const handleSelectAll = useCallback(() => {
    setLooks((looks) =>
      looks.map((look) => ({ ...look, isSelected: !isSelectedAll }))
    );
  }, [isSelectedAll]);

  /** 選択済みを削除ボタン */
  const lookAPI = useAuthenticatedAPI(LookAPI);

  const handleDeleteSelected = useCallback(async () => {
    const selectedLookIds = looks
      .filter((look) => look.isSelected)
      .map((look) => look.id);

    try {
      await lookAPI.delete(selectedLookIds);
      setLooks((looks) =>
        looks.filter((look) => !selectedLookIds.includes(look.id))
      );
    } catch (error) {
      // TODO: エラーメッセージ
    }
  }, [looks]);

  return { isSelectedAll, handleSelectAll, handleDeleteSelected };
};
