import { useState, useEffect } from "react";
import { getAvatarUrl } from "../../lib/storage";

type Props = {
  avatarPath: string | null;
  userId: string;
  alt: string;
  size?: number;
};

export default function Avatar({ avatarPath, userId, alt, size = 40 }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setUrl(null); // clear old url immediately while new one loads
    getAvatarUrl(avatarPath, userId).then((newUrl) => {
      if (!cancelled) setUrl(newUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [avatarPath, userId]);

  if (!url)
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "var(--color-gray-200)",
          flexShrink: 0,
        }}
      />
    );

  return (
    <img
      src={url}
      alt={alt}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
        display: "block",
      }}
    />
  );
}
