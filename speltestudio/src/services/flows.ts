import { flowStore } from "../store";
import type { IFlowDefinition, IAPIResource } from "../flowCanvas/types";
import { isEqual, differenceWith } from "lodash";
import { currentFlowStore } from "../flowCanvas/canvasStore";

let currentFlow: IFlowDefinition;
currentFlowStore.subscribe((flow) => {
  currentFlow = flow;
});

export const flowSyncService = (flowApi: IAPIResource<IFlowDefinition>) => ({
  saveFlow: async function saveFlow() {
    console.debug(currentFlow);
    console.debug(JSON.stringify(currentFlow));
    const existingFlow = flowApi.read(currentFlow.id);
    if (existingFlow !== undefined) {
      flowApi.update(currentFlow.id, currentFlow);
    } else {
      flowApi.create(currentFlow);
    }
  },

  updateClientFlows: async function updateClientFlows(): Promise<void> {
    const apiFlows: IFlowDefinition[] = await flowApi
      .readall()
      .then((data) => data.json());

    flowStore.update((clientFlows) => {
      return [
        ...clientFlows,
        ...differenceWith(apiFlows, clientFlows, isEqual),
      ];
    });
  },
});
