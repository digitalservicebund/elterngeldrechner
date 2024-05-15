import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState, AppDispatch, AppStore } from "./index";

// Use typed dispatch and selectors throughout your app instead of plain any-typed `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const createAppSelector = createSelector.withTypes<RootState>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = useStore.withTypes<AppStore>();
