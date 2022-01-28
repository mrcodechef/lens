/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React, { createRef, useEffect } from "react";
import { observer } from "mobx-react";
import { InfoPanel } from "../info-panel/info-panel";
import { LogResourceSelector } from "./resource-selector";
import { LogList, LogListRef } from "./list";
import { LogSearch } from "./search";
import { LogControls } from "./controls";
import { withInjectables } from "@ogre-tools/injectable-react";
import logsViewModelInjectable from "./logs-view-model.injectable";
import type { LogTabViewModel } from "./logs-view-model";
import type { DockTabData } from "../dock/store";
import { cssNames, Disposer } from "../../../utils";
import type { KubeWatchSubscribeStoreOptions } from "../../../kube-watch-api/kube-watch-api";
import subscribeStoresInjectable from "../../../kube-watch-api/subscribe-stores.injectable";
import type { KubeObjectStore } from "../../../../common/k8s-api/kube-object.store";
import type { KubeObject } from "../../../../common/k8s-api/kube-object";
import type { PodStore } from "../../+pods/store";
import podStoreInjectable from "../../+pods/store.injectable";

export interface LogsDockTabProps {
  className?: string;
  tab: DockTabData;
}

interface Dependencies {
  model: LogTabViewModel;
  subscribeStores: (stores: KubeObjectStore<KubeObject>[], opts?: KubeWatchSubscribeStoreOptions) => Disposer;
  podStore: PodStore;
}

const NonInjectedLogsDockTab = observer(({ podStore, className, tab, model, subscribeStores }: Dependencies & LogsDockTabProps) => {
  const logListElement = createRef<LogListRef>();
  const data = model.logTabData.get();

  useEffect(() => {
    model.reloadLogs();

    return model.stopLoadingLogs;
  }, []);
  useEffect(() => subscribeStores([
    podStore,
  ], {
    namespaces: data ? [data.namespace] : [],
  }), [data?.namespace]);

  const scrollToOverlay = (overlayLine: number | undefined) => {
    if (!logListElement.current || overlayLine === undefined) {
      return;
    }

    // Scroll vertically
    logListElement.current.scrollToItem(overlayLine, "center");
    // Scroll horizontally in timeout since virtual list need some time to prepare its contents
    setTimeout(() => {
      const overlay = document.querySelector(".PodLogs .list span.active");

      if (!overlay) return;
      overlay.scrollIntoViewIfNeeded();
    }, 100);
  };

  if (!data) {
    return null;
  }

  return (
    <div className={cssNames("PodLogs flex column", className)}>
      <InfoPanel
        tabId={tab.id}
        controls={(
          <div className="flex gaps">
            <LogResourceSelector model={model} />
            <LogSearch
              model={model}
              scrollToOverlay={scrollToOverlay}
            />
          </div>
        )}
        showSubmitClose={false}
        showButtons={false}
        showStatusPanel={false}
      />
      <LogList model={model} ref={logListElement} />
      <LogControls model={model} />
    </div>
  );
});


export const LogsDockTab = withInjectables<Dependencies, LogsDockTabProps>(NonInjectedLogsDockTab, {
  getProps: (di, props) => ({
    model: di.inject(logsViewModelInjectable, {
      tabId: props.tab.id,
    }),
    subscribeStores: di.inject(subscribeStoresInjectable),
    podStore: di.inject(podStoreInjectable),
    ...props,
  }),
});