import { Button, ButtonGroup } from "@shopify/polaris";

import DeleteButton from "../DeleteButton/DeleteButton";
import { SelectAllButton } from "../../SelectAllButton";

type Props = {
  isSelectedAll: boolean;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onEditSelected: () => void;
};

export const Buttons = ({
  isSelectedAll,
  onSelectAll,
  onDeleteSelected,
  onEditSelected,
}: Props) => {
  return (
    <ButtonGroup>
      <SelectAllButton
        isSelectedAll={isSelectedAll}
        onSelectAll={onSelectAll}
      />
      <DeleteButton
        label="選択済みを削除"
        onDeleteCallback={onDeleteSelected}
      />
      <Button onClick={onEditSelected}>選択したものを一括編集</Button>
    </ButtonGroup>
  );
};
