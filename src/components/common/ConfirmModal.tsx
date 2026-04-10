import { HiExclamationTriangle } from "react-icons/hi2";
import styles from "./ConfirmModal.module.css";
import clsx from "clsx";

type Props = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className={clsx("modal", styles.modal)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.iconWrapper}>
          <div
            className={clsx(styles.iconCircle, styles[`iconCircle_${variant}`])}
          >
            <HiExclamationTriangle size={24} />
          </div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={clsx(
              "btn",
              variant === "danger" ? "btn-danger" : "btn-primary",
            )}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
