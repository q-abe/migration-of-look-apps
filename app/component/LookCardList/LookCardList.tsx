import { InlineStack } from "@shopify/polaris";
import { SelectIcon } from '@shopify/polaris-icons';
import type { ComponentProps, FC} from "react";
import { useCallback } from "react";
import { ActiveBadge } from '~/component/Icons/ActiveBadge/ActiveBadge';
import { LookCard } from '~/component/LookCard/LookCard';


type Props = {
  looks: LookCardType[];
  onSelectLook: ComponentProps<typeof SelectIcon>["onSelect"];
  onEditClick?: ComponentProps<typeof EditableLookCard>["onEditClick"];
};

export const LookCardList = ({ looks, onSelectLook, onEditClick }: Props) => {
  return (
    <InlineStack>
      {looks.map((look) => (
        <EditableLookCard
          key={`${look.id}select`}
          look={look}
          onSelectLook={onSelectLook}
          onEditClick={onEditClick}
        />
      ))}
    </InlineStack>
  );
};

const EditableLookCard: FC<{
  look: LookCardType;
  onSelectLook: ComponentProps<typeof SelectIcon>["onSelect"];
  onEditClick?: (id: number) => void;
}> = ({ look, onSelectLook, onEditClick }) => {
  const onClickImage = useCallback(() => {
    onEditClick?.(look.id);
  }, [onEditClick]);

  return (
    <LookCard
      key={look.id}
      imagePath={look.mediaUrl}
      onClickImage={onClickImage}
      headIcons={[
        <SelectIcon
          key={`${look.id}select`}
          id={look.id}
          isSelected={look.isSelected ?? false}
          onSelect={onSelectLook}
        />,
      ]}
      footIcons={[
        <ActiveBadge key={`${look.id}active`} isActive={look.isActive} />,
      ]}
    />
  );
};
