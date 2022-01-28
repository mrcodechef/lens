/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { AddNamespaceDialogState } from "./add-dialog.state.injectable";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { bind } from "../../utils";
import addNamespaceDialogStateInjectable from "./add-dialog.state.injectable";

interface Dependencies {
  addNamespaceDialogState: AddNamespaceDialogState;
}

function openAddNamespaceDialog({ addNamespaceDialogState }: Dependencies) {
  addNamespaceDialogState.isOpen = true;
}

const openAddNamespaceDialogInjectable = getInjectable({
  instantiate: (di) => bind(openAddNamespaceDialog, null, {
    addNamespaceDialogState: di.inject(addNamespaceDialogStateInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default openAddNamespaceDialogInjectable;
