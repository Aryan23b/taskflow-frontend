import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastType =
  | "success"
  | "error"
  | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (
    message: string,
    type?: ToastType
  ) => void;

  removeToast: (
    id: number
  ) => void;
}

const ToastContext =
  createContext<ToastContextValue | null>(
    null
  );


export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [toasts, setToasts] =
    useState<ToastItem[]>([]);


  const removeToast = useCallback(
    (id: number) => {

      setToasts((previous) =>
        previous.filter(
          (toast) =>
            toast.id !== id
        )
      );

    },
    []
  );


  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "success"
    ) => {

      const id =
        Date.now() +
        Math.floor(
          Math.random() * 1000
        );

      setToasts((previous) => [
        ...previous,
        {
          id,
          message,
          type,
        },
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, 3500);

    },
    [removeToast]
  );


  const value = useMemo(
    () => ({
      showToast,
      removeToast,
    }),
    [
      showToast,
      removeToast,
    ]
  );


  return (
    <ToastContext.Provider
      value={value}
    >

      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">

        {toasts.map((toast) => {

          const styles = {
            success:
              "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
            error:
              "border-rose-400/20 bg-rose-400/10 text-rose-200",
            info:
              "border-indigo-400/20 bg-indigo-400/10 text-indigo-200",
          };

          const icons = {
            success: "✓",
            error: "!",
            info: "i",
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${styles[toast.type]}`}
            >

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold">
                {icons[toast.type]}
              </div>

              <p className="flex-1 text-sm leading-5">
                {toast.message}
              </p>

              <button
                onClick={() =>
                  removeToast(
                    toast.id
                  )
                }
                className="text-xs opacity-60 hover:opacity-100"
              >
                ✕
              </button>

            </div>
          );

        })}

      </div>

    </ToastContext.Provider>
  );
}


export function useToast() {

  const context =
    useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}