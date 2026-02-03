import { QueryCache } from "@/query/data/cache";
import { QueryErrorStates } from "@/query/data/error";
import { QueryListeners } from "@/query/data/listeners";
import { QueryLoadingStates } from "@/query/data/loading";
import { QueryPromises } from "@/query/data/promises";

/**
 * cache object
 */
export const queryCache = new QueryCache();

/**
 * loading object
 */
export const queryLoadingStates = new QueryLoadingStates();

/**
 * error object
 */
export const queryErrorStates = new QueryErrorStates();

/**
 * listeners object
 */
export const queryListeners = new QueryListeners();

/**
 * promises object
 */
export const queryPromises = new QueryPromises();
