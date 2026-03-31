import { useState, useEffect } from "react";
import { getSignedUrl } from "../../lib/storage";

const DEFAULT_IMAGE = "defaults/default-list-cover.svg";

type Props = {
  imagePath: string | null;
  alt: string;
};

export default function ListImage({ imagePath, alt }: Props) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const path = imagePath ?? DEFAULT_IMAGE;
    getSignedUrl(path)
      .then(setSignedUrl)
      .catch(() => setSignedUrl(null));
  }, [imagePath]);

  if (!signedUrl) return <div>Loading image...</div>;

  return <img src={signedUrl} alt={alt} />;
}
