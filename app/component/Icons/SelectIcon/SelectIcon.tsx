import { Checkbox } from "@shopify/polaris";
import { useCallback } from "react";

type SelectIconProps = {
  id: number;
  isSelected: boolean;
  onSelect?: (newSelected: boolean, id: number) => void;
};

export const SelectIcon = ({ id, isSelected, onSelect }: SelectIconProps) => {
  const onSelectWrapper = useCallback(
    (newSelected: boolean) => onSelect?.(newSelected, id),
    [onSelect, id]
  );

  return <Checkbox label="" checked={isSelected} onChange={onSelectWrapper} />;
};
