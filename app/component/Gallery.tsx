import { Banner, Button, Card, DataTable, InlineStack, Layout, Page } from '@shopify/polaris';
import type { ComponentProps} from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GalleryAPI } from '~/api/GalleryAPI';
import { formatDate } from '~/api/helpers/date';
import { ActivePopover } from '~/component/ActivePopover';
import DeleteButton from '~/component/DeleteButton/DeleteButton';
import { GalleryEditModal } from '~/component/GalleryEditModal/GalleryEditModal';
import { useAuthenticatedAPI } from '~/hooks/useAuthenticatedAPI';
import { useModal } from '~/hooks/useModal';
import { useMountedState } from '~/hooks/useMountedState';
import { ToastContent, useToast } from '~/hooks/useToast';

const TableHeadings = [
  "ID",
  "タイトル",
  "ステータス",
  "作成日時",
  "更新日時",
  "", // 「編集、複製、削除」ボタン用
];
const TableContentType: ComponentProps<typeof DataTable>["columnContentTypes"] =
  ["text", "text", "text", "text", "text", "text"];

const DateFormat = "yyyy年MM月dd日 HH:mm:ss";

export const Gallery = () => {
  const [galleries, setGalleries] = useState<GalleryResponse[]>([]);
  const [galleryInAction, setGalleryInAction] = useState<GalleryResponse>();
  const [activeEditModal, openEditModal, closeEditModal] = useModal();
  const { showToast } = useToast();
  const { isMounted } = useMountedState();

  const galleryAPI = useAuthenticatedAPI(GalleryAPI);

  useEffect(() => {
    (async () => {
      const galleries = await galleryAPI.getAll();
      if (isMounted()) setGalleries(galleries);
    })();
  }, []);

  const handleAddGallery = useCallback(() => {
    setGalleryInAction(undefined);
    openEditModal();
  }, []);

  const handleSaveGallery = useCallback((gallery) => {
    setGalleries((galleries) => {
      // 既に存在する場合は置き換え、存在しない場合は追加
      const index = galleries.findIndex((g) => g.id === gallery.id);
      if (index === -1) {
        galleries.unshift(gallery);
      } else {
        galleries[index] = gallery;
      }
      return [...galleries];
    });

    closeEditModal();
    showToast({ content: ToastContent.saveGallery });
  }, []);

  const handleEdit = (gallery: GalleryResponse) => {
    setGalleryInAction(gallery);
    openEditModal();
  };

  const handleCopy = async (gallery: GalleryResponse) => {
    const title = `${gallery.title}のコピー`;
    const createdGallery = await galleryAPI.create(title, gallery.looks);
    handleSaveGallery(createdGallery);
    showToast({ content: ToastContent.copyGallery(title) });
  };

  const handleDelete = async (gallery: GalleryResponse) => {
    try {
      await galleryAPI.delete(gallery.id);
      setGalleries((galleries) => galleries.filter((g) => g.id !== gallery.id));
    } catch (error) {
      // TODO: エラー処理
    }
  };

  const handleSelectActive = useCallback(
    async (newActive, id) => {
      const selectedGallery = galleries.find((gallery) => gallery.id === id);
      // 変更がない場合は処理しない
      if (selectedGallery == null || selectedGallery.isActive === newActive)
        return;

      setGalleries((galleries) =>
        galleries.map((g) => (g.id === id ? { ...g, isActive: newActive } : g))
      );

      await galleryAPI.update(
        id,
        selectedGallery.title ?? "",
        selectedGallery.looks,
        newActive
      );
    },
    [galleries]
  );

  const tableData = useMemo(() => {
    return galleries.map((gallery) => [
      gallery.id,
      gallery.title,
      <ActivePopover
        id={gallery.id}
        isActive={gallery.isActive}
        onSelect={handleSelectActive}
      />,
      gallery.registeredAt
        ? formatDate(new Date(gallery.registeredAt), DateFormat)
        : "",
      gallery.modifiedAt
        ? formatDate(new Date(gallery.modifiedAt), DateFormat)
        : "",
      <InlineStack spacing="baseTight" wrap={false} alignment="center">
        <Button onClick={() => handleEdit(gallery)}>編集</Button>
        <Button onClick={() => handleCopy(gallery)}>複製</Button>
        <DeleteButton onDeleteCallback={() => handleDelete(gallery)} />
      </InlineStack>,
    ]);
  }, [galleries]);

  const handleDeleteLooks = (looks: LookCard[]) => {
    setGalleries((galleries) =>
      galleries.map((gallery) => ({
        ...gallery,
        looks: gallery.looks.filter((look) =>
          looks.some((l) => look.id === l.id)
        ),
      }))
    );
  };

  return (
    // <p>gallery</p>
    <Page>
      {/* TODO: エラー表示 */}
      {false && <Banner />}
      <Page fullWidth>
        <Layout>
          <Layout.Section>
            <InlineStack vertical spacing="loose">
              <InlineStack vertical alignment="trailing">
                <Button primary onClick={handleAddGallery}>
                  ギャラリー追加
                </Button>
              </InlineStack>
              <Card>
                <DataTable
                  headings={TableHeadings}
                  columnContentTypes={TableContentType}
                  rows={tableData}
                  verticalAlign="middle"
                  hideScrollIndicator
                />
              </Card>
            </InlineStack>
          </Layout.Section>
        </Layout>
      </Page>
      <GalleryEditModal
        key={`${galleryInAction?.id}${activeEditModal}`}
        gallery={galleryInAction}
        active={activeEditModal}
        onClose={closeEditModal}
        onSaveGallery={handleSaveGallery}
        onDeleteLooks={handleDeleteLooks}
      />
    </Page>
  );
};
