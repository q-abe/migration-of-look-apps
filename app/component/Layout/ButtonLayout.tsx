import { InlineStack } from "@shopify/polaris";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  buttonElement: JSX.Element;
}>;

export const ButtonLayout = ({ children, buttonElement }: Props) => {
  return (
    <InlineStack vertical spacing="loose">
      {buttonElement}
      {children}
      {buttonElement}
    </InlineStack>
  );
};
