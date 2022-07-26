/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import rolesRouteInjectable from "../../../../../common/front-end-routing/routes/cluster/user-management/roles/roles-route.injectable";
import { routeSpecificComponentInjectionToken } from "../../../../routes/route-specific-component-injection-token";
import { AddRoleDialog } from "./view";

const addRoleDialogRouteComponentInjectable = getInjectable({
  id: "add-role-dialog-route-component",

  instantiate: (di) => ({
    route: di.inject(rolesRouteInjectable),
    Component: AddRoleDialog,
  }),

  injectionToken: routeSpecificComponentInjectionToken,
});

export default addRoleDialogRouteComponentInjectable;
