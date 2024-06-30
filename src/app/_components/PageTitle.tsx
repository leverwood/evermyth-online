import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  children?: ReactNode;
}

const PageTitle = ({ title, children }: PageTitleProps) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default PageTitle;
