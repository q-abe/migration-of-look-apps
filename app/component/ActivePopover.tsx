import { ActionList, Button, Popover } from "@shopify/polaris";
import { ComponentProps, useCallback, useMemo, useState } from "react";

type Props = {
  id: number;
  isActive: boolean;
  onSelect: (newActive: boolean, id: number) => void;
};

export const ActivePopover = ({ id, isActive, onSelect }: Props) => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const onSelectWrapper = useCallback(
    (newActive: boolean) => {
      onSelect(newActive, id);
      togglePopoverActive();
    },
    [id, onSelect, togglePopoverActive]
  );

  const activator = useMemo(() => {
    return (
      <Button
        onClick={togglePopoverActive}
        disclosure={popoverActive ? "up" : "down"}
      >
        {isActive ? "有効" : "無効"}
      </Button>
    );
  }, [isActive, togglePopoverActive, popoverActive]);

  const actionItems = useMemo<
    ComponentProps<typeof ActionList>["items"]
  >(() => {
    return [
      { content: "有効", onAction: () => onSelectWrapper(true) },
      { content: "無効", onAction: () => onSelectWrapper(false) },
    ];
  }, [id, onSelect]);

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
    >
      <ActionList actionRole="menuitem" items={actionItems} />
    </Popover>
  );
};
