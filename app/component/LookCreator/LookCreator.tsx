import { DropZone } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { readFile } from '~/api/helpers/file';
import { LookAPI } from '~/api/LookAPI';
import { LookAddModal } from '~/component/LookCreator/LookAddModal/LookAddModal';
import { useAuthenticatedAPI } from '~/hooks/useAuthenticatedAPI';
import { ToastContent, useToast } from '~/hooks/useToast';





/** アップロード可能な画像種別 */
const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

type Props = {
  onCreate: (createdLooks: LookResponse[]) => void;
};

export const LookCreator = ({ onCreate }: Props) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  const lookAPI = useAuthenticatedAPI(LookAPI);

  const handleCancalLookAdd = useCallback((cancelFile: File) => {
    setImageFiles((files) =>
      files.filter((file) => file.name !== cancelFile.name)
    );
  }, []);

  const handleClickLookAddButton = useCallback(async () => {
    setIsCreating(true);

    const assets = [];
    for (const file of imageFiles) {
      assets.push({
        fileName: file.name,
        attachment: await readFile(file),
      });
    }
    const createdLooks = await lookAPI.create(assets);
    setImageFiles([]);
    setIsCreating(false);

    onCreate(createdLooks);
    showToast({ content: ToastContent.createLook(createdLooks.length) });
  }, [imageFiles]);

  return (
    <>
      <DropZone
        accept={validImageTypes.join(",")}
        type="image"
        onDropAccepted={setImageFiles}
      >
        <DropZone.FileUpload actionHint="or drop images to upload" />
      </DropZone>
      <LookAddModal
        files={imageFiles}
        loading={isCreating}
        onCancel={handleCancalLookAdd}
        onClickAddButton={handleClickLookAddButton}
      />
    </>
  );
};
