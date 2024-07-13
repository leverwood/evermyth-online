import { ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  href: string;
  variant?: string;
  className?: string;
  children: ReactNode;
}

const Button = ({ href, variant, children, className }: ButtonProps) => {
  return href ? (
    <a
      href={href}
      className={`${styles.root} ${
        variant ? styles[variant] : styles.primary
      } ${className ? className : ""}`}
    >
      {children}
    </a>
  ) : (
    <button>{children}</button>
  );
};

export default Button;
