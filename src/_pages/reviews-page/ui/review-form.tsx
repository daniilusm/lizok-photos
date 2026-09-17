"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";

import {
  type ReviewFormValues,
  reviewFormSchema,
} from "@/shared/api/mailer/schema";
import { projectTypes } from "@/shared/stub/projects";
import { Button } from "@/shared/ui/button";
import { typografText } from "@/shared/utils/typograf";

import s from "./review-form.module.scss";

const REVIEW_ENDPOINT =
  process.env.NEXT_PUBLIC_REVIEW_API_URL || "/send-review.php";

const SHOOT_TYPES = projectTypes.map((type) => type.name);

type FormFields = {
  shootType: string;
  name: string;
  text: string;
};

type ReviewFormProps = {
  className?: string;
};

type ShootTypeDropdownProps = {
  value: string;
  invalid?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

const ShootTypeDropdown = ({
  value,
  invalid,
  error,
  onChange,
}: ShootTypeDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const labelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root || !(event.target instanceof Node)) return;
      if (!root.contains(event.target)) setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const selectType = (type: string) => {
    onChange(type);
    setIsOpen(false);
  };

  return (
    <div className={s.field} ref={rootRef}>
      <span className={s.label} id={labelId}>
        {typografText("Тип фотосессии")}
      </span>

      <div className={clsx(s.dropdown, isOpen && s.dropdownOpen)}>
        <button
          type="button"
          className={clsx(
            s.trigger,
            invalid && s.invalid,
            !value && s.placeholder,
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-labelledby={labelId}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>
            {value ? typografText(value) : typografText("Выберите тип")}
          </span>
          <span className={s.chevron} aria-hidden />
        </button>

        <div
          id={listId}
          className={clsx(s.list, isOpen && s.listOpen)}
          role="listbox"
          aria-labelledby={labelId}
          aria-hidden={!isOpen}
        >
          {SHOOT_TYPES.map((type) => {
            const selected = type === value;

            return (
              <button
                key={type}
                type="button"
                role="option"
                aria-selected={selected}
                className={clsx(s.option, selected && s.optionSelected)}
                tabIndex={isOpen ? 0 : -1}
                onClick={() => selectType(type)}
              >
                {typografText(type)}
              </button>
            );
          })}
        </div>
      </div>

      {error && <span className={s.error}>{error}</span>}
    </div>
  );
};

export const ReviewForm = ({ className }: ReviewFormProps) => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      shootType: "",
      name: "",
      text: "",
    },
  });

  const shootType = watch("shootType");

  useEffect(() => {
    register("shootType");
  }, [register]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus("idle");
    setStatusMessage("");

    const parsed = reviewFormSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "shootType" || field === "name" || field === "text") {
          setError(field, { message: issue.message });
        }
      }
      return;
    }

    try {
      const response = await fetch(REVIEW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data satisfies ReviewFormValues),
      });

      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Не удалось отправить отзыв");
      }

      reset({ shootType: "", name: "", text: "" });
      setStatus("success");
      setStatusMessage(payload.message || "Спасибо! Отзыв отправлен");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Ошибка при отправке. Напишите в соцсети.",
      );
    }
  });

  return (
    <form
      className={clsx(s.root, className)}
      onSubmit={onSubmit}
      noValidate
      aria-label={typografText("Оставить отзыв")}
    >
      <ShootTypeDropdown
        value={shootType}
        invalid={Boolean(errors.shootType)}
        error={errors.shootType?.message}
        onChange={(value) =>
          setValue("shootType", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      />

      <label className={s.field}>
        <span className={s.label}>{typografText("Имя")}</span>
        <input
          className={clsx(s.input, errors.name && s.invalid)}
          type="text"
          autoComplete="name"
          placeholder={typografText("Как вас подписать")}
          {...register("name")}
        />
        {errors.name?.message && (
          <span className={s.error}>{errors.name.message}</span>
        )}
      </label>

      <label className={s.field}>
        <span className={s.label}>{typografText("Отзыв")}</span>
        <textarea
          className={clsx(s.textarea, errors.text && s.invalid)}
          rows={5}
          placeholder={typografText("Расскажите, как прошла съёмка")}
          {...register("text")}
        />
        {errors.text?.message && (
          <span className={s.error}>{errors.text.message}</span>
        )}
      </label>

      <Button className={s.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? typografText("Отправляем…")
          : typografText("Отправить отзыв")}
      </Button>

      {status !== "idle" && statusMessage && (
        <output
          className={clsx(s.status, status === "success" ? s.ok : s.fail)}
        >
          {typografText(statusMessage)}
        </output>
      )}
    </form>
  );
};

ReviewForm.displayName = "ReviewForm";
