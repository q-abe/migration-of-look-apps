import React, { FC, useCallback, useMemo, useState } from "react";
import { Button, ButtonGroup, Icon, Popover } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import { styles } from "./DeleteButton.style";

type Props = {
  onDeleteCallback?: () => void;
  label?: string;
};

const DeleteButton: FC<Props> = ({ onDeleteCallback = () => {}, label }) => {
  const [active, setActive] = useState(false);

  const activate = useCallback(() => {
    setActive(true);
  }, []);

  const inactivate = useCallback(() => {
    setActive(false);
  }, []);

  const onDelete = useCallback(() => {
    inactivate();
    onDeleteCallback();
  }, [onDeleteCallback]);

  const activator = useMemo(() => {
    if (label) {
      return (
        <Button onClick={activate} destructive disabled={active}>
          {label}
        </Button>
      );
    }
    return (
      <div css={styles.icon} onClick={activate}>
        <Icon source={DeleteIcon} />
      </div>
    );
  }, [label, active]);

  return (
    <Popover activator={activator} active={active} onClose={inactivate}>
      <div css={styles.popoverInner}>
        <p>本当に削除しますか?</p>
        <ButtonGroup segmented={true}>
          <Button onClick={inactivate}>いいえ</Button>
          <Button onClick={onDelete} destructive>
            はい
          </Button>
        </ButtonGroup>
      </div>
    </Popover>
  );
};

export default DeleteButton;
