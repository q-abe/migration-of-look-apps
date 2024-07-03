import { Button, ButtonGroup, InlineStack } from "@shopify/polaris";

import DeleteButton from "../../DeleteButton/DeleteButton";
import { SelectAllButton } from "../../SelectAllButton";

type Props = {
  isSelectedAll: boolean;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onAddSelected: () => void;
};

export const Buttons = ({
  isSelectedAll,
  onSelectAll,
  onDeleteSelected,
  onAddSelected,
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
      </ButtonGroup>
      <Button onClick={onAddSelected} primary>
        選択済みルックをギャラリーに追加
      </Button>
    </InlineStack>
  );
};
