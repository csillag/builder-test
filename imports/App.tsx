import React from 'react';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import { CollectionsDemoApp } from '/imports/approach-1-mongo-collections/client';
import { MethodsDemoApp } from '/imports/approach-2-meteor-methods/client';
import { HttpApiDemoApp } from '/imports/approach-3-http-api/client';
const { TabPane } = Tabs;

/**
 * The list of different approaches
 */
const approaches: Record<string, JSX.Element> = {
    ['Mongo Collections']: <CollectionsDemoApp />,
    ['Meteor Methods']: <MethodsDemoApp />,
    ['HTTP API']: <HttpApiDemoApp />,
};

const MainMenu = () => (
    <Tabs defaultActiveKey="0">
        {Object.keys(approaches).map((key, index) => (
            <TabPane tab={key} key={index}>
                {approaches[key]}
            </TabPane>
        ))}
    </Tabs>
);

export const App = () => (
    <div>
        <h1>Csillag's Builder Test App</h1>
        <MainMenu />
    </div>
);
