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
    getAvatarUrl(avatarPath, userId).then(setUrl);
  }, [avatarPath, userId]);

  if (!url) return <div style={{ width: size, height: size }}>...</div>;

  return (
    <img
      src={url}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: "50%" }}
    />
  );
}
