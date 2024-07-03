import { Banner, Frame, Layout, Page } from "@shopify/polaris";
import { useCallback } from "react";
import { useButtonAction } from '~/hooks/useButtonAction';
import { useLookCardList } from '~/hooks/useLookCardList';
import { useLooks } from '~/hooks/useLooks';
import { useModal } from '~/hooks/useModal';
import { useToast } from '~/hooks/useToast';


export const Look = () => {
  const [looks, setLooks, editingLookId, setEditingLookId, updateLook] =
    useLooks();
  const [activeEditModal, openEditModal, closeEditModal] = useModal();
  const { handleSelectLookCard, handleCreateLook } = useLookCardList(setLooks);
  const { isSelectedAll, handleSelectAll, handleDeleteSelected } =
    useButtonAction(looks, setLooks);
  const { showToast } = useToast();

  // TODO: 複数編集対応時に使う
  const openEditModalAsMulti = useCallback(() => {}, []);

  const handleEditSelected = useCallback(async (look: LookCard) => {
    updateLook(look);
    showToast({
      content: `ルックを更新しました。`,
    });
    setEditingLookId(undefined);
    closeEditModal();
  }, []);

  const handleEditLookCard = useCallback((id: number) => {
    setEditingLookId(() => id);
    openEditModal();
  }, []);

  return (
    <p>look</p>
    // <Frame>
    //   {/* TODO: エラー表示 */}
    //   {false && <Banner />}
    //   <Page fullWidth>
    //     <Layout>
    //       <Layout.Section>
    //         <p>so</p>
    //         {/*<InlineStack vertical spacing="loose">*/}
    //         {/*  <LookCreator onCreate={handleCreateLook} />*/}
    //         {/*  <ButtonLayout*/}
    //         {/*    buttonElement={*/}
    //         {/*      <Buttons*/}
    //         {/*        isSelectedAll={isSelectedAll}*/}
    //         {/*        onSelectAll={handleSelectAll}*/}
    //         {/*        onDeleteSelected={handleDeleteSelected}*/}
    //         {/*        onEditSelected={openEditModalAsMulti}*/}
    //         {/*      />*/}
    //         {/*    }*/}
    //         {/*  >*/}
    //         {/*    <LookCardList*/}
    //         {/*      looks={looks}*/}
    //         {/*      onSelectLook={handleSelectLookCard}*/}
    //         {/*      onEditClick={handleEditLookCard}*/}
    //         {/*    />*/}
    //         {/*  </ButtonLayout>*/}
    //         {/*</InlineStack>*/}
    //       </Layout.Section>
    //     </Layout>
    //   </Page>
    //   {/*<LookEditModal*/}
    //   {/*  key={editingLookId}*/}
    //   {/*  active={activeEditModal}*/}
    //   {/*  lookId={editingLookId}*/}
    //   {/*  onSave={handleEditSelected}*/}
    //   {/*  onClose={closeEditModal}*/}
    //   {/*/>*/}
    // </Frame>
  );
};
