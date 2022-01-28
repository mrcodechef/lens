/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { when } from "mobx";
import { TerminalApi, TerminalChannels } from "../../../api/terminal-api";
import { bind, noop } from "../../../utils";
import { Notifications } from "../../notifications";
import selectDockTabInjectable from "../dock/select-tab.injectable";
import type { DockTabData, TabId } from "../dock/store";
import createTerminalTabInjectable from "./create-tab.injectable";
import getTerminalApiInjectable from "./get-terminal-api.injectable";

interface Dependencies {
  selectTab: (tabId: TabId) => void;
  createTerminalTab: () => DockTabData;
  getTerminalApi: (tabId: TabId) => TerminalApi;
}

export interface SendCommandOptions {
  /**
   * Emit an enter after the command
   */
  enter?: boolean;

  /**
   * @deprecated This option is ignored and infered to be `true` if `tabId` is not provided
   */
  newTab?: any;

  /**
   * Specify a specific terminal tab to send this command to
   */
  tabId?: TabId;
}

async function sendCommand({ selectTab, createTerminalTab, getTerminalApi }: Dependencies, command: string, options: SendCommandOptions = {}): Promise<void> {
  let { tabId } = options;

  if (tabId) {
    selectTab(tabId);
  } else {
    tabId = createTerminalTab().id;
  }

  await when(() => Boolean(getTerminalApi(tabId)));

  const terminalApi = getTerminalApi(tabId);
  const shellIsReady = when(() =>terminalApi.isReady);
  const notifyVeryLong = setTimeout(() => {
    shellIsReady.cancel();
    Notifications.info(
      "If terminal shell is not ready please check your shell init files, if applicable.",
      {
        timeout: 4_000,
      },
    );
  }, 10_000);

  await shellIsReady.catch(noop);
  clearTimeout(notifyVeryLong);

  if (terminalApi) {
    if (options.enter) {
      command += "\r";
    }

    terminalApi.sendMessage({
      type: TerminalChannels.STDIN,
      data: command,
    });
  } else {
    console.warn(
      "The selected tab is does not have a connection. Cannot send command.",
      { tabId, command },
    );
  }
}

const sendCommandInjectable = getInjectable({
  instantiate: (di) => bind(sendCommand, null, {
    createTerminalTab: di.inject(createTerminalTabInjectable),
    selectTab: di.inject(selectDockTabInjectable),
    getTerminalApi: di.inject(getTerminalApiInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default sendCommandInjectable;