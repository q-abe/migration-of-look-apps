import { Button, Icon, Image, Modal, InlineStack } from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";

import { styles } from "./LookAddModal.style";

type Props = {
  files: File[];
  loading: boolean;
  onCancel: (cancelFile: File) => void;
  onClickAddButton: () => void;
};

export const LookAddModal = ({
  files,
  loading,
  onCancel,
  onClickAddButton,
}: Props) => {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive((active) => !active), []);

  useEffect(() => {
    setActive(files.length > 0);
  }, [files]);

  return (
    <Modal
      title=""
      open={active}
      onClose={handleChange}
      loading={loading}
      large
    >
      <Modal.Section>
        <InlineStack vertical spacing="tight">
          <InlineStack>
            {files.map((file) => (
              <div css={styles.thumbnailWrapper} key={file.name}>
                <button
                  css={styles.cancelButton}
                  onClick={() => onCancel(file)}
                >
                  <Icon source={XSmallIcon} color="base" />
                </button>
                <Image
                  alt={file.name}
                  source={window.URL.createObjectURL(file)}
                  width="100%"
                  height="100%"
                />
              </div>
            ))}
          </InlineStack>
          <InlineStack distribution="trailing">
            <Button primary onClick={onClickAddButton}>
              ルックを作成
            </Button>
          </InlineStack>
        </InlineStack>
      </Modal.Section>
    </Modal>
  );
};
