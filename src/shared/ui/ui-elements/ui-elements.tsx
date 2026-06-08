import type { ComponentProps } from "react";
import clsx from "clsx";

import s from "./ui-elements.module.scss";

export type UIElementsProps = ComponentProps<"div"> & {
  className?: string;
};

export const UIElements = (props: UIElementsProps) => {
  const { className } = props;

  return (
    <div className={clsx(s.root, className)}>
      <div className={s.wrapper}>
        <div className={s.corner} />
        <div className={s.corner} />
        <div className={s.corner} />
        <div className={s.corner} />

        <div className={s.date}>
          <p>16.05.2026</p>
          <p className={s.time}>16:00</p>
        </div>
      </div>
    </div>
  );
};

UIElements.displayName = "UIElements";
