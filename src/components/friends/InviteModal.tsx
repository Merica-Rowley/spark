import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

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
    <div>
      <div>
        <h2>Invite a Friend</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {!inviteUrl ? (
        <div>
          <p>
            Generate a one-time invite link to share with a friend via text,
            email, or QR code.
          </p>
          {error && <p>{error}</p>}
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Invite Link"}
          </button>
        </div>
      ) : (
        <div>
          <p>Share this link or have your friend scan the QR code:</p>

          <div>
            <QRCodeSVG value={inviteUrl} size={200} />
          </div>

          <div>
            <input type="text" readOnly value={inviteUrl} />
            <button onClick={handleCopy}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <p>This link expires in 7 days and can only be used once.</p>

          <button onClick={handleGenerate} disabled={loading}>
            Generate New Link
          </button>
        </div>
      )}
    </div>
  );
}
