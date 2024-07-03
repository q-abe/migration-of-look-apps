import { Button, ButtonGroup, InlineStack } from "@shopify/polaris";

import DeleteButton from "../../DeleteButton/DeleteButton";
import { SelectAllButton } from "../../SelectAllButton";

type Props = {
  isSelectedAll: boolean;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onAddLook: () => void;
  onSave: () => void;
};

export const Buttons = ({
  isSelectedAll,
  onSelectAll,
  onDeleteSelected,
  onAddLook,
  onSave,
}: Props) => {
  return (
    <InlineStack distribution="equalSpacing">
      <ButtonGroup>
        <SelectAllButton
          isSelectedAll={isSelectedAll}
          onSelectAll={onSelectAll}
        />
        <DeleteButton
          label="選択済みを削除"
          onDeleteCallback={onDeleteSelected}
        />
        <Button onClick={onAddLook} primary>
          ルックを追加
        </Button>
      </ButtonGroup>
      <Button onClick={onSave} primary>
        保存
      </Button>
    </InlineStack>
  );
};
