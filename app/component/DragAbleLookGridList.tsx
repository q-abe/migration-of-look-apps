import type { ComponentProps} from "react";
import { useCallback, useMemo } from "react";


import DragAbleList, {
  DragableItem,
  DummyDragedItem,
  useDraged,
} from "./DragableList";
import {
  ActiveBadge,
  DragHandleIcons,
  FeatureIcon,
  SelectIcon,
} from "./Icons";
import { LookCard } from "./LookCard";

type Props = {
  items: LookCardType[];
  onDropCallback: (items: LookCardType[]) => void;
} & Pick<LookCardWrapperProps, "onSelect" | "onEditClick" | "onFeaturedClick">;

/**
 * IDはstringの必要があるので、string用の型を定義
 */
type LookCardTypeHasStringId = Omit<LookCardType, "id"> & {
  id: string;
};

const DragAbleLookGridList = ({
  items,
  onDropCallback = () => {},
  ...lookCardWrapperProps
}: Props) => {
  // IDの型がstringでないと上手く動作しないので、ルック一覧のIDをstringに変更する
  const dragAbleItems = useMemo(
    () => items.map((item) => ({ ...item, id: String(item.id) })),
    [items]
  );
  // コールバック時は number に戻して返す
  const onDropCallbackWrapper = (items: LookCardTypeHasStringId[]) => {
    onDropCallback(items.map((item) => ({ ...item, id: Number(item.id) })));
  };

  const { activeItem, wrappedOnDropCallback, wrappedOnDragCallback } =
    useDraged(dragAbleItems, { onDropCallback: onDropCallbackWrapper });

  return (
    <DragAbleList
      items={dragAbleItems}
      onDropCallback={wrappedOnDropCallback}
      onDragCallback={wrappedOnDragCallback}
      layout="grid"
    >
      {dragAbleItems.map((item) => (
        <DragableItem key={item.id} id={item.id}>
          <LookCardWrapper
            key={item.id}
            item={item}
            {...lookCardWrapperProps}
          />
        </DragableItem>
      ))}
      <DummyDragedItem id={activeItem?.id}>
        <LookCardWrapper item={activeItem} {...lookCardWrapperProps} />
      </DummyDragedItem>
    </DragAbleList>
  );
};
DragAbleLookGridList.displayName = "DragableLookGridList";

type LookCardWrapperProps = {
  item: any; // TODO: 型定義
  onSelect: ComponentProps<typeof SelectIcon>["onSelect"];
  onEditClick: (id: number) => void;
  onFeaturedClick: ComponentProps<typeof FeatureIcon>["onClick"];
};

const LookCardWrapper = ({
  item,
  onSelect,
  onEditClick,
  onFeaturedClick,
}: LookCardWrapperProps) => {
  const onClickImage = useCallback(() => {
    onEditClick(parseInt(item.id));
  }, [item, onEditClick]);

  return (
    <LookCard
      imagePath={item.mediaUrl}
      onClickImage={onClickImage}
      headIcons={[
        <SelectIcon
          key={`${item.id}select`}
          id={Number(item.id)}
          isSelected={item.isSelected}
          onSelect={onSelect}
        />,
        <FeatureIcon
          key={`${item.id}Featured`}
          id={Number(item.id)}
          isFeatured={item.isFeatured}
          onClick={onFeaturedClick}
        />,
      ]}
      footIcons={[
        <ActiveBadge key={`${item.id}active`} isActive={item.isActive} />,
        <DragHandleIcons key={`${item.id}drag`} id={item.id} />,
      ]}
    />
  );
};

export default DragAbleLookGridList;
