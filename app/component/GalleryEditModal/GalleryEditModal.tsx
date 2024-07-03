import { Modal, InlineStack, TextField } from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import { GalleryAPI } from '~/api/GalleryAPI';
import DragAbleLookGridList from '~/component/DragAbleLookGridList';
import { Buttons } from '~/component/GalleryEditModal/Buttons/Buttons';
import { GalleryLookAddModal } from '~/component/GalleryLookAddModal/GalleryLookAddModal';
import { ButtonLayout } from '~/component/Layout/ButtonLayout';
import { LookEditModal } from '~/component/LookEditModal/LookEditModal';
import { useAuthenticatedAPI } from '~/hooks/useAuthenticatedAPI';
import { useButtonAction } from '~/hooks/useButtonAction';
import { useLookCardList } from '~/hooks/useLookCardList';
import { useLooks } from '~/hooks/useLooks';
import { useModal } from '~/hooks/useModal';
import { ToastContent, useToast } from '~/hooks/useToast';

type Props = {
  gallery?: Gallery;
  active: boolean;
  onClose: () => void;
  onSaveGallery: (gallery: Gallery) => void;
  onDeleteLooks: (looks: LookCard[]) => void;
};

export const GalleryEditModal = ({
  gallery,
  active,
  onClose,
  onSaveGallery,
  onDeleteLooks,
}: Props) => {
  const useLooksOption = useMemo(() => {
    return { initialLooks: gallery?.looks ?? [] };
  }, [gallery]);
  const [looks, setLooks, editingLookId, setEditingLookId, updateLook] =
    useLooks(useLooksOption);
  const [title, setTitle] = useState(gallery?.title ?? "");
  const [loading, setLoading] = useState(false);
  const [activeLookAddModal, openLookAddModal, closeLookAddModal] = useModal();
  const [activeLookEditModal, openLookEditModal, closeLookEditModal] =
    useModal();
  const { showToast } = useToast();
  const { isSelectedAll, handleSelectAll } = useButtonAction(looks, setLooks);

  const galleryAPI = useAuthenticatedAPI(GalleryAPI);
  const { handleSelectLookCard } = useLookCardList(setLooks);

  const handleAddLooks = useCallback((addLooks: LookCard[]) => {
    setLooks((looks) => [
      ...addLooks.map((addLook) => ({ ...addLook, isFeatured: false })),
      ...looks,
    ]);
    closeLookAddModal();
    showToast({ content: ToastContent.addLookToGallery });
  }, []);

  const saveGallery = useCallback(async () => {
    setLoading(true);
    const savedGallery = await (() => {
      if (gallery == null) {
        return galleryAPI.create(title, looks);
      }
      return galleryAPI.update(gallery.id, title, looks, gallery.isActive);
    })();
    onSaveGallery(savedGallery);
    setLoading(false);
  }, [title, looks, onSaveGallery]);

  const handleClickFeatured = useCallback(
    (newFeatured: boolean, id: number) => {
      setLooks((looks) =>
        looks.map((look) =>
          look.id === id ? { ...look, isFeatured: newFeatured } : look
        )
      );
    },
    []
  );

  const handleDeleteSelected = useCallback(() => {
    setLooks((looks) => looks.filter((look) => !look.isSelected));
  }, []);

  const handleDeleteLooks = useCallback(
    (looksAfterDelete: LookCard[]) => {
      // 削除後のルック一覧と比較して、削除されたルックは排除する
      setLooks((looks) =>
        looks.filter((look) => looksAfterDelete.some((l) => look.id === l.id))
      );
      onDeleteLooks(looksAfterDelete);
    },
    [onDeleteLooks]
  );

  const handleEditLookCard = useCallback((id: number) => {
    setEditingLookId(() => id);
    openLookEditModal();
  }, []);

  const handleEditSelected = useCallback(async (look: LookCard) => {
    updateLook(look);
    showToast({
      content: `ルックを更新しました。`,
    });
    setEditingLookId(undefined);
    closeLookEditModal();
  }, []);

  return (
    <>
      <Modal title="" open={active} onClose={onClose} loading={loading} large>
        <Modal.Section>
          <InlineStack vertical spacing="loose">
            <TextField
              label="タイトル"
              autoComplete="off"
              value={title}
              onChange={setTitle}
            />
            <ButtonLayout
              buttonElement={
                <Buttons
                  isSelectedAll={isSelectedAll}
                  onSelectAll={handleSelectAll}
                  onDeleteSelected={handleDeleteSelected}
                  onAddLook={openLookAddModal}
                  onSave={saveGallery}
                />
              }
            >
              <DragAbleLookGridList
                items={looks}
                onDropCallback={setLooks}
                onFeaturedClick={handleClickFeatured}
                onEditClick={handleEditLookCard}
                onSelect={handleSelectLookCard}
              />
            </ButtonLayout>
          </InlineStack>
        </Modal.Section>
      </Modal>
      <GalleryLookAddModal
        addedLooks={looks}
        active={activeLookAddModal}
        onClose={closeLookAddModal}
        onAddLooks={handleAddLooks}
        onDeleteLooks={handleDeleteLooks}
      />
      <LookEditModal
        key={editingLookId}
        active={activeLookEditModal}
        lookId={editingLookId}
        onSave={handleEditSelected}
        onClose={closeLookEditModal}
        hideGalleries
      />
    </>
  );
};
