// src/hooks/useConfirm.ts
import { useState, useCallback } from "react";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
};

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(
    null,
  );

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((res) => {
      setOptions(opts);
      setResolve(() => res);
    });
  }, []);

  const handleConfirm = () => {
    resolve?.(true);
    setOptions(null);
    setResolve(null);
  };

  const handleCancel = () => {
    resolve?.(false);
    setOptions(null);
    setResolve(null);
  };

  return { confirm, options, handleConfirm, handleCancel };
}
