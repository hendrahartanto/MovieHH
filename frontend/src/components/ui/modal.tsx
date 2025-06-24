import { useEffect, type ReactNode } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

export type ModalType = "create" | "delete" | "update" | null;

interface Props {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children, title }: Props) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full mx-4 bg-card border border-border p-6 rounded-xl shadow-2xl transition-all transform scale-100 animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200 group"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
        </button>

        {title && (
          <div className="mb-6 pr-8">
            <h1 className="text-foreground text-xl font-semibold">{title}</h1>
            <div className="mt-2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          </div>
        )}

        <div className="text-card-foreground">{children}</div>
      </div>
    </div>,
    document.body
  );
};
