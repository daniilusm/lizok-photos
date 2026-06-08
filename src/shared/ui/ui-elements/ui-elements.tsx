import { type ComponentProps, useMemo } from "react";
import clsx from "clsx";

import s from "./ui-elements.module.scss";

export type UIElementsProps = ComponentProps<"div"> & {
  className?: string;
};

export const UIElements = (props: UIElementsProps) => {
  const { className } = props;

  const date = useMemo(() => {
    return new Date().toLocaleDateString();
  }, []);

  const time = useMemo(() => {
    return new Date().toTimeString();
  }, []);

  return (
    <div className={clsx(s.root, className)}>
      <div className={s.wrapper}>
        <div className={s.corner} />
        <div className={s.corner} />
        <div className={s.corner} />
        <div className={s.corner} />

        <div className={s.date}>
          <p>{date}</p>
          <p className={s.time}>{time}</p>
        </div>
      </div>
    </div>
  );
};

UIElements.displayName = "UIElements";
