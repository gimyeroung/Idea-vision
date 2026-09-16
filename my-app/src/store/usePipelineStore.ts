import { useSyncExternalStore } from "react";

import type { DetectedObject } from "../shared/types/pipeline";

type PipelineState = {
    selectedObject: DetectedObject | null;
};

let state: PipelineState = {
    selectedObject: null,
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return state;
}

function setSelectedObject(selectedObject: DetectedObject | null) {
    state = { ...state, selectedObject };
    listeners.forEach((listener) => listener());
}

export function usePipelineStore() {
    const currentState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    return {
        ...currentState,
        setSelectedObject,
    };
}
