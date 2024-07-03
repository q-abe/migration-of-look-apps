import { Button } from "@shopify/polaris";
import { ComposeIcon } from "@shopify/polaris-icons";
import { useCallback } from "react";

type EditIconProps = {
  id: number;
  onClick?: (id: number) => void;
};

export const EditIcon = ({ id, onClick }: EditIconProps) => {
  const onClickWrapper = useCallback(() => onClick?.(id), [onClick, id]);

  return (
    <Button icon={ComposeIcon} onClick={onClickWrapper} plain monochrome />
  );
};
