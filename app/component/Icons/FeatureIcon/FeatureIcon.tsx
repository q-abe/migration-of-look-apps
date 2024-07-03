import { Button } from "@shopify/polaris";
import { StarFilledIcon, StarIcon } from "@shopify/polaris-icons";
import { useCallback } from "react";

type FeatureIconProps = {
  id: number;
  isFeatured: boolean;
  onClick?: (newFeatured: boolean, id: number) => void;
};

export const FeatureIcon = ({ id, isFeatured, onClick }: FeatureIconProps) => {
  const onClickWrapper = useCallback(
    () => onClick?.(!isFeatured, id),
    [onClick, isFeatured, id]
  );

  return (
    <Button
      icon={isFeatured ? StarFilledIcon : StarIcon}
      onClick={onClickWrapper}
      plain
      monochrome
    />
  );
};
