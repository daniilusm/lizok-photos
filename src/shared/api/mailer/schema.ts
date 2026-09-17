import { z } from "zod";

const phoneDigits = (value: string) => value.replace(/\D/g, "");

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя")
    .max(100, "Слишком длинное имя"),
  shootDate: z.string().min(1, "Укажите дату съёмки"),
  phone: z
    .string()
    .trim()
    .refine((value) => {
      const digits = phoneDigits(value);
      return digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"));
    }, "Укажите телефон в формате +7 (999) 999-99-99"),
  comment: z
    .string()
    .trim()
    .max(2000, "Комментарий слишком длинный")
    .optional()
    .transform((value) => value ?? ""),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const reviewFormSchema = z.object({
  shootType: z.string().trim().min(1, "Выберите тип фотосессии"),
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя")
    .max(100, "Слишком длинное имя"),
  text: z
    .string()
    .trim()
    .min(10, "Напишите чуть подробнее")
    .max(4000, "Текст слишком длинный"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

/** Маска телефона РФ: +7 (999) 999-99-99 */
export const formatRuPhoneMask = (raw: string): string => {
  let digits = phoneDigits(raw);

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }
  if (!digits.startsWith("7") && digits.length > 0) {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11);

  const rest = digits.slice(1);
  let result = "+7";

  if (rest.length === 0) return result;

  result += ` (${rest.slice(0, 3)}`;
  if (rest.length < 3) return result;

  result += `) ${rest.slice(3, 6)}`;
  if (rest.length < 6) return result;

  result += `-${rest.slice(6, 8)}`;
  if (rest.length < 8) return result;

  result += `-${rest.slice(8, 10)}`;
  return result;
};

export const getPhoneDigits = phoneDigits;
