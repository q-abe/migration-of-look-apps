import { Icon } from "@shopify/polaris";
import { DragHandleIcon } from '@shopify/polaris-icons';
import { DragableHandle } from '~/component/DragableList/DragAbleList';

type Props = {
  id: number;
};

export const DragHandleIcons = ({ id }: Props) => {
  return (
    <DragableHandle id={String(id)}>
      <Icon source={DragHandleIcon} />
    </DragableHandle>
  );
};