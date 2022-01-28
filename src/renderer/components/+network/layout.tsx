/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";
import { observer } from "mobx-react";
import { TabLayout, TabLayoutRoute } from "../layout/tab-layout";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { IComputedValue } from "mobx";
import networkRoutesInjectable from "./routes.injectable";

export interface NetworkLayoutProps {}

interface Dependencies {
  routes: IComputedValue<TabLayoutRoute[]>;
}

const NonInjectedNetworkLayout = observer(({ routes }: Dependencies & NetworkLayoutProps) => (
  <TabLayout
    className="Network"
    tabs={routes.get()}
  />
));

export const NetworkLayout = withInjectables<Dependencies, NetworkLayoutProps>(NonInjectedNetworkLayout, {
  getProps: (di, props) => ({
    routes: di.inject(networkRoutesInjectable),
    ...props,
  }),
});