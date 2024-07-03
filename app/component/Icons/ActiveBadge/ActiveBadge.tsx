import { Badge } from "@shopify/polaris";

type Props = {
  isActive: boolean;
};

export const ActiveBadge = ({ isActive }: Props) => {
  return (
    <Badge status={isActive ? "attention" : undefined}>
      {isActive ? "有効" : "無効"}
    </Badge>
  );
};
