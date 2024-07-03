import { Dispatch, SetStateAction, useCallback } from "react";
import { LookResponse } from '../../../Documents/Project/Q/public-look-app/src/types/Look.type';
import { LookCard } from '../../../Documents/Project/Q/public-look-app/src/types/LookCard';

/**
 * ルック一覧を使用する際のhooks
 * 共通処理をここで定義
 */
export const useLookCardList = (
  setLooks: Dispatch<SetStateAction<LookCard[]>>
) => {
  const handleSelectLookCard = useCallback(
    (newSelected: boolean, id: number) => {
      setLooks((looks) =>
        looks.map((look) => ({
          ...look,
          isSelected: look.id === id ? newSelected : look.isSelected,
        }))
      );
    },
    []
  );

  const handleCreateLook = useCallback((createdLooks: LookResponse[]) => {
    setLooks((looks) => [
      ...createdLooks.map((l) => ({ ...l, isSelected: false })),
      ...looks,
    ]);
  }, []);

  return {
    handleSelectLookCard,
    handleCreateLook,
  };
};
