// Toast notification system - handles showing success/error messages to users
// This is a pretty complex piece of code but it's basically a global state manager for toasts
import * as React from "react";

const TOAST_LIMIT = 1; // Only show one toast at a time to avoid spam
const TOAST_REMOVE_DELAY = 1000000; // Keep toasts around for a while

// Action types for our reducer - like Redux but simpler
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST", 
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

// Generate unique IDs for each toast
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Keep track of timeouts so we can cancel them if needed
const toastTimeouts = new Map();

// Queue up a toast for removal after the delay
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return; // Already queued
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// Reducer to manage toast state - handles all the different actions
export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        // Add new toast to the front, limit total number
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        // Find and update the specific toast
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Queue up toasts for removal (with animation time)
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        // Dismiss all toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        // Mark toasts as closed so they can animate out
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [], // Clear all
        };
      }
      return {
        ...state,
        // Actually remove the toast from the array
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// Global state management - all components can listen to changes
const listeners = [];
let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  // Notify all listeners about the state change
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Main function to show a toast - this is what components actually call
function toast({ ...props }) {
  const id = genId();

  // Helper functions for this specific toast
  const update = (props) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Add the toast to the state
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss(); // Auto-dismiss when closed
      },
    },
  });

  // Return controls for this toast
  return {
    id: id,
    dismiss,
    update,
  };
}

// Hook for components to use the toast system
function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    // Subscribe to state changes
    listeners.push(setState);
    return () => {
      // Clean up subscription
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast, // Function to show new toasts
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }), // Function to dismiss toasts
  };
}

export { useToast, toast };