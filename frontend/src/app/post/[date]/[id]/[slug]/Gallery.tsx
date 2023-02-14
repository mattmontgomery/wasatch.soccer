import styles from "@/app/styles/text.module.css";

import { getPhotoRaw } from "@/app/util/api";
import Image from "next/image";

export default function Gallery({
  photos,
}: {
  photos: App.Photo[];
}): React.ReactElement {
  return (
    <div className={styles.photoGallery}>
      {photos.map((p, idx) => {
        const photo = getPhotoRaw(p, "large");
        return (
          <div key={idx}>
            <Image
              src={photo.url}
              alt={p.attributes.alternativeText}
              width={photo.width}
              height={photo.height}
            />
            <div className={styles.caption}>{p.attributes.caption}</div>
          </div>
        );
      })}
    </div>
  );
}
