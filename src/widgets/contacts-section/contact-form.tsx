"use client";

import { useState } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";

import {
  type ContactFormValues,
  contactFormSchema,
  formatRuPhoneMask,
} from "@/shared/api/mailer/schema";
import { Button } from "@/shared/ui/button";
import { typografText } from "@/shared/utils/typograf";

import s from "./contact-form.module.scss";

const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_API_URL || "/send-contact.php";

type FormFields = {
  name: string;
  shootDate: string;
  phone: string;
  comment: string;
};

type ContactFormProps = {
  className?: string;
};

export const ContactForm = ({ className }: ContactFormProps) => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      shootDate: "",
      phone: "+7",
      comment: "",
    },
  });

  const phoneRegister = register("phone", { required: true });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("idle");
    setStatusMessage("");

    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (
          field === "name" ||
          field === "shootDate" ||
          field === "phone" ||
          field === "comment"
        ) {
          setError(field, { message: issue.message });
        }
      }
      return;
    }

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data satisfies ContactFormValues),
      });

      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Не удалось отправить заявку");
      }

      reset({ name: "", shootDate: "", phone: "+7", comment: "" });
      setStatus("success");
      setStatusMessage(payload.message || "Заявка отправлена");
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
      aria-label={typografText("Заявка на съёмку")}
    >
      <label className={s.field}>
        <span className={s.label}>{typografText("Имя")}</span>
        <input
          className={clsx(s.input, errors.name && s.invalid)}
          type="text"
          autoComplete="name"
          placeholder={typografText("Как к вам обращаться")}
          {...register("name")}
        />
        {errors.name?.message && (
          <span className={s.error}>{errors.name.message}</span>
        )}
      </label>

      <label className={s.field}>
        <span className={s.label}>{typografText("Дата съёмки")}</span>
        <input
          className={clsx(s.input, errors.shootDate && s.invalid)}
          type="date"
          {...register("shootDate")}
        />
        {errors.shootDate?.message && (
          <span className={s.error}>{errors.shootDate.message}</span>
        )}
      </label>

      <label className={s.field}>
        <span className={s.label}>{typografText("Телефон")}</span>
        <input
          className={clsx(s.input, errors.phone && s.invalid)}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (999) 999-99-99"
          {...phoneRegister}
          onChange={(event) => {
            const masked = formatRuPhoneMask(event.target.value);
            setValue("phone", masked, {
              shouldDirty: true,
              shouldValidate: status !== "idle",
            });
          }}
        />
        {errors.phone?.message && (
          <span className={s.error}>{errors.phone.message}</span>
        )}
      </label>

      <label className={s.field}>
        <span className={s.label}>{typografText("Комментарий")}</span>
        <textarea
          className={clsx(s.textarea, errors.comment && s.invalid)}
          rows={4}
          placeholder={typografText("Пожелания к съёмке, локация, формат…")}
          {...register("comment")}
        />
        {errors.comment?.message && (
          <span className={s.error}>{errors.comment.message}</span>
        )}
      </label>

      <Button className={s.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? typografText("Отправляем…")
          : typografText("Отправить заявку")}
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

ContactForm.displayName = "ContactForm";
