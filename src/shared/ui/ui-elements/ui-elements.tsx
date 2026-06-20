import { type ComponentProps, useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import { _pad } from "@/shared/utils/string";

import s from "./ui-elements.module.scss";

const formatCurrentTime = (date: Date) => {
  const hours = _pad(date.getHours(), 2);
  const minutes = _pad(date.getMinutes(), 2);
  const seconds = _pad(date.getSeconds(), 2);

  return `${hours}:${minutes}:${seconds}`;
};

export type UIElementsProps = ComponentProps<"div"> & {
  className?: string;
};

export const UIElements = (props: UIElementsProps) => {
  const { className } = props;

  const date = useMemo(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const formattedDate = today
      .toLocaleDateString("ru-RU", options)
      .split(".")
      .join("/");

    return formattedDate;
  }, []);

  const [time, setTime] = useState(() => formatCurrentTime(new Date()));

  useEffect(() => {
    const updateTime = () => {
      setTime(formatCurrentTime(new Date()));
    };

    updateTime();

    const intervalId = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={clsx(s.root, className)}>
      <div className={s.wrapper}>
        <div className={s.corner} />
        <div className={s.corner} />
        <div className={s.corner} />
        <div className={s.corner} />

        {/* <div className={s.grid} /> */}

        <div className={s.date}>
          <p>{date}</p>
          <p className={s.time}>{time}</p>
        </div>
      </div>
    </div>
  );
};

UIElements.displayName = "UIElements";
