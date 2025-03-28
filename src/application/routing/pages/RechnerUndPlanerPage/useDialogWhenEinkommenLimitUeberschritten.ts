import { type RefObject, useCallback, useEffect } from "react";
import { YesNo } from "@/application/features/abfrageteil/state";
import { useAppStore } from "@/application/redux/hooks";

export function useDialogWhenEinkommenLimitUeberschritten(
  dialogElement: RefObject<HTMLDialogElement>,
  elementToFocusAfterDialogClosed: RefObject<HTMLElement>,
) {
  const store = useAppStore();

  const openDialogWhenEinkommenLimitUebeschritten = useCallback(() => {
    const { limitEinkommenUeberschritten } = store.getState().stepEinkommen;
    const isEinkommenLimitUeberschritten =
      limitEinkommenUeberschritten === YesNo.YES;

    if (isEinkommenLimitUeberschritten) dialogElement.current?.showModal();
  }, [store, dialogElement]);

  const closeDialog = useCallback(() => {
    dialogElement.current?.close();
    elementToFocusAfterDialogClosed.current?.focus();
  }, [dialogElement, elementToFocusAfterDialogClosed]);

  useEffect(openDialogWhenEinkommenLimitUebeschritten);

  return { closeDialog };
}
