import { Gallery } from '~/component/Gallery';
import { Look } from '~/component/Look';

type Tab = {
  Gallery: number, Look: number, Setting: number
}

// export const TabContents = ({ selectedTab, Tab }: { selectedTab: number; Tab: Tab }) => {
//   if (selectedTab === Tab.Gallery) return <Gallery />;
//   if (selectedTab === Tab.Look) return <Look />;
//   // TODO: Setting画面
//   return <Look />;
// };
export const TabContents = ({ selectedTab, Tab }: { selectedTab: number; Tab: Tab }) => {
  console.log("selectedTab",selectedTab)
  if (selectedTab === Tab.Gallery) return <Gallery/>;
  if (selectedTab === Tab.Look) return <Look/>;
  // TODO: Setting画面
  return <p>設定</p>;
};

