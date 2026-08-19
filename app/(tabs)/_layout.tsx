import { Tabs } from "expo-router";

import { TabBar } from "@/components/TabBar";

/**
 * A route group, so these screens keep their existing URLs (/homepage,
 * /progressAnalytics, /profilePage) while gaining real tab navigation. Each tab
 * now keeps its own state and scroll position instead of remounting on every
 * visit.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="homepage" options={{ title: "Train" }} />
      <Tabs.Screen name="progressAnalytics" options={{ title: "Progress" }} />
      <Tabs.Screen name="profilePage" options={{ title: "Profile" }} />
    </Tabs>
  );
}
