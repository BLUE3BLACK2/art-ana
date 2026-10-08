import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function AdminDialog({
  title,
  onClose,
  children,
  wide = false,
}) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`studio-dialog${wide ? " studio-dialog-wide" : ""}`}
      aria-labelledby="studio-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="studio-dialog-header">
        <h2 id="studio-dialog-title">{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function DeleteConfirmation({ title, description, onConfirm, onClose }) {
  return (
    <AdminDialog title={title} onClose={onClose}>
      <p className="admin-muted">{description}</p>
      <div className="studio-dialog-actions">
        <button className="secondary-button" onClick={onClose}>
          Keep it
        </button>
        <button className="gallery-button" onClick={onConfirm}>
          Delete permanently
        </button>
      </div>
    </AdminDialog>
  );
}
