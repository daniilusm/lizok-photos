import clsx from "clsx";

import s from "./Text.module.scss";

type TextProps = {
  className?: string;
};

const Text = (props: TextProps) => {
  const { className } = props;

  return <div className={clsx(s.root, className)} />;
};

Text.displayName = "Text";

export default Text;
