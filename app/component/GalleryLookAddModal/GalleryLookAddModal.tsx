import { InlineStack, Modal } from "@shopify/polaris";
import { useCallback, useMemo, useRef } from "react";
import { Buttons } from '~/component/GalleryLookAddModal/Buttons/Buttons';
import { ButtonLayout } from '~/component/Layout/ButtonLayout';
import { LookCardList } from '~/component/LookCardList/LookCardList';
import { LookCreator } from '~/component/LookCreator/LookCreator';
import { useButtonAction } from '~/hooks/useButtonAction';
import { useLookCardList } from '~/hooks/useLookCardList';
import { useLooks } from '~/hooks/useLooks';


type Props = {
  addedLooks?: LookCard[];
  active: boolean;
  onClose: () => void;
  onAddLooks: (addLooks: LookCard[]) => void;
  onDeleteLooks: (looks: LookCard[]) => void;
};

export const GalleryLookAddModal = ({
  addedLooks,
  active,
  onClose,
  onAddLooks,
  onDeleteLooks,
}: Props) => {
  const useLooksOption = useMemo(() => {
    return { excludeLooks: addedLooks };
  }, [addedLooks]);

  const [looks, setLooks] = useLooks(useLooksOption);
  const { handleSelectLookCard, handleCreateLook } = useLookCardList(setLooks);
  const { isSelectedAll, handleSelectAll, handleDeleteSelected } =
    useButtonAction(looks, setLooks);
  // ルックの削除を実行したか
  const isDeleted = useRef(false);
  if (isDeleted.current) {
    onDeleteLooks(looks);
    isDeleted.current = false;
  }

  const handleAddSelected = useCallback(() => {
    // 選択済みのルックにフィルタ後、選択状態は解除しておく
    const selectedLooks = looks
      .filter((look) => look.isSelected)
      .map((look) => ({ ...look, isSelected: false }));

    // 再度開いた際に選択状態を引き継がないように、本モーダルのルックも更新
    setLooks((looks) => looks.map((look) => ({ ...look, isSelected: false })));

    onAddLooks(selectedLooks);
  }, [looks, onAddLooks]);

  const handleDeleteSelectedWrapper = useCallback(() => {
    isDeleted.current = true;
    handleDeleteSelected();
  }, [handleDeleteSelected]);

  return (
    <Modal title="" open={active} onClose={onClose} large>
      <Modal.Section>
        <InlineStack vertical spacing="loose">
          <LookCreator onCreate={handleCreateLook} />
          <ButtonLayout
            buttonElement={
              <Buttons
                isSelectedAll={isSelectedAll}
                onSelectAll={handleSelectAll}
                onDeleteSelected={handleDeleteSelectedWrapper}
                onAddSelected={handleAddSelected}
              />
            }
          >
            <LookCardList looks={looks} onSelectLook={handleSelectLookCard} />
          </ButtonLayout>
        </InlineStack>
      </Modal.Section>
    </Modal>
  );
};
