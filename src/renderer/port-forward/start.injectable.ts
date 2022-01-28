/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import portForwardStoreInjectable from "./store.injectable";

const startPortForwardInjectable = getInjectable({
  instantiate: (di) => di.inject(portForwardStoreInjectable).startPortForward,
  lifecycle: lifecycleEnum.singleton,
});

export default startPortForwardInjectable;