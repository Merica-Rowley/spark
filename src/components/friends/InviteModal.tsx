import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  HiXMark,
  HiUserPlus,
  HiClipboard,
  HiCheck,
  HiArrowPath,
} from "react-icons/hi2";
import styles from "./InviteModal.module.css";
import clsx from "clsx";

type Props = {
  onClose: () => void;
  onGenerateInvite: () => Promise<string>;
};

export default function InviteModal({ onClose, onGenerateInvite }: Props) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = await onGenerateInvite();
      setInviteUrl(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate invite",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Invite a Friend</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <HiXMark size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {!inviteUrl ? (
            // Generate state
            <div className={styles.generateState}>
              <div className={styles.generateIcon}>
                <HiUserPlus size={28} />
              </div>
              <div>
                <p className={styles.generateTitle}>Invite someone to Spark</p>
                <p className={styles.generateDescription}>
                  Generate a one-time invite link to share via text, email, or
                  have your friend scan the QR code in person.
                </p>
              </div>
              {error && <p className={styles.error}>{error}</p>}
            </div>
          ) : (
            // Invite generated state
            <>
              {/* QR Code */}
              <div className={styles.qrSection}>
                <p className={styles.qrLabel}>Scan to join</p>
                <div className={styles.qrWrapper}>
                  <QRCodeSVG value={inviteUrl} size={180} level="M" />
                </div>
              </div>

              {/* Link */}
              <div className={styles.linkSection}>
                <p className={styles.linkLabel}>Or share the link</p>
                <div className={styles.linkRow}>
                  <input
                    className={styles.linkInput}
                    type="text"
                    readOnly
                    value={inviteUrl}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    className={clsx(
                      styles.copyButton,
                      copied && styles.copyButtonSuccess,
                    )}
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <HiCheck size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <HiClipboard size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className={styles.expiryNote}>
                This link expires in 7 days and can only be used once.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              "Generating..."
            ) : inviteUrl ? (
              <>
                <HiArrowPath size={16} />
                New Link
              </>
            ) : (
              <>
                <HiUserPlus size={16} />
                Generate Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
