import * as React from "react";
import { Tabs } from "antd";
const { TabPane } = Tabs;

/**
 * The list of different approaches
 */
const approaches: Record<string, JSX.Element> = {
  ["Method 1"]: <div>Magic comes here</div>,
  ["Method 2"]: <div>More magic comes here</div>,
};

export const MainMenu = () => (
  <Tabs defaultActiveKey="1">
    {Object.keys(approaches).map((key, index) => (
      <TabPane tab={key} key={index}>
        {approaches[key]}
      </TabPane>
    ))}
  </Tabs>
);
