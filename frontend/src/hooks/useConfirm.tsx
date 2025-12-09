import { useState, type ReactNode } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface Options {
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  color?: "primary" | "error" | "inherit";
}

export const useConfirm = () => {
  const [options, setOptions] = useState<Options & { open: boolean; resolve: (res: boolean) => void }>({
    open: false,
    message: "",
    resolve: () => {},
  });

  const confirm = (opts: Options): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({ ...opts, open: true, resolve });
    });
  };

  const handleConfirm = () => {
    options.resolve(true);
    setOptions((prev) => ({ ...prev, open: false }));
  };

  const handleClose = () => {
    options.resolve(false);
    setOptions((prev) => ({ ...prev, open: false }));
  };

  const ConfirmDialogComponent = (
    <ConfirmDialog
      open={options.open}
      title={options.title}
      message={options.message}
      onConfirm={handleConfirm}
      onClose={handleClose}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      color={options.color}
    />
  );

  return { confirm, ConfirmDialogComponent };
};
