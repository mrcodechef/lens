/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import clusterStoreInjectable from "./store.injectable";

const getClusterByIdInjectable = getInjectable({
  instantiate: (di) => di.inject(clusterStoreInjectable).getById,
  lifecycle: lifecycleEnum.singleton,
});

export default getClusterByIdInjectable;