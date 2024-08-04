import { ReactNode } from "react";
import cx from "classnames";

import styles from "./Button.module.scss";

interface ButtonProps {
  href?: string;
  variant?: string;
  className?: string;
  children: ReactNode;
}

const Button = ({ href, variant, children, className }: ButtonProps) => {
  return href ? (
    <a
      href={href}
      className={cx(
        styles.root,
        variant ? styles[variant] : styles.primary,
        className
      )}
    >
      {children}
    </a>
  ) : (
    <button
      className={cx(
        styles.root,
        variant ? styles[variant] : styles.primary,
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
