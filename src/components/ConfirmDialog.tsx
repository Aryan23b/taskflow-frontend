import {
  useEffect,
  useState,
} from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = true,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {

      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [open, onClose]);


  if (!open) {
    return null;
  }


  async function handleConfirm() {

    try {

      setLoading(true);

      await onConfirm();

    } finally {

      setLoading(false);

    }
  }


  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {

        if (
          event.currentTarget ===
          event.target
        ) {
          onClose();
        }

      }}
    >

      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">

        <div className="flex items-start gap-4">

          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg",
              danger
                ? "bg-rose-400/10 text-rose-300"
                : "bg-indigo-400/10 text-indigo-300",
            ].join(" ")}
          >
            {danger ? "!" : "?"}
          </div>


          <div>

            <h2 className="text-lg font-semibold text-white">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {description}
            </p>

          </div>

        </div>


        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
          >
            {cancelText}
          </button>


          <button
            onClick={handleConfirm}
            disabled={loading}
            className={[
              "rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50",
              danger
                ? "bg-rose-500 hover:bg-rose-400"
                : "bg-indigo-500 hover:bg-indigo-400",
            ].join(" ")}
          >
            {loading
              ? "Working..."
              : confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}