import { Button } from "@shopify/polaris";

type Props = {
  isSelectedAll: boolean;
  onSelectAll: () => void;
};

export const SelectAllButton = ({ isSelectedAll, onSelectAll }: Props) => {
  return (
    <Button onClick={onSelectAll}>
      {isSelectedAll ? "全て外す" : "全て選択"}
    </Button>
  );
};
