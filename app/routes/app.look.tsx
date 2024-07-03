import { Card, Tabs } from '@shopify/polaris';
import type { ComponentProps } from 'react';
import { useCallback, useState } from 'react';
import { TabContents } from '~/component/test';

export default function Test() {

  const tabs: ComponentProps<typeof Tabs>["tabs"] = [
    { id: "gallery", content: "ギャラリー" },
    { id: "look", content: "ルック", },
    { id: "setting", content: "設定" } ];

  const Tab = {
    Gallery: 0, Look: 1, Setting: 2,
  };

  const [ selectedTab, setSelectedTab ] = useState(Tab.Gallery);
  const handleTabChange = useCallback((selectedTabIndex: number) => setSelectedTab(selectedTabIndex), []);

  return (<Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
    <Card>
      <TabContents selectedTab={selectedTab} Tab={Tab} />
    </Card>
  </Tabs>);
}
