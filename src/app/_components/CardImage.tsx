import cx from "classnames";
import Image from "next/image";

import styles from "./CardImage.module.scss";
import Icon, { ICON_NAMES } from "./Icon";

interface CardImageProps {
  src?: string;
  alt?: string;
  iconName?: ICON_NAMES;
  className?: string;
}

const CardImage = ({
  src,
  alt,
  iconName = ICON_NAMES.WORLD,
  className,
}: CardImageProps) => {
  return (
    <div className={cx(styles.cardImage, className)}>
      {src ? (
        <Image src={src} alt={alt || "Card image"} />
      ) : (
        <Icon name={iconName} />
      )}
    </div>
  );
};

export default CardImage;
