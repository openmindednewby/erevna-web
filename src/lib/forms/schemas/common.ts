import { z } from 'zod';

import { isValueDefined } from '../../../utils/is';

const PASSWORD_MIN_LENGTH = 8;

const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

export function requiredString(messageKey = 'validation.required'): z.ZodString {
  return z.string().min(1, { message: messageKey });
}

export const emailSchema = z.string().email({ message: 'validation.email.invalid' });
export const phoneSchema = z.string().regex(PHONE_REGEX, { message: 'validation.phone.invalid' });

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, { message: 'validation.password.minLength' })
  .regex(/[A-Z]/, { message: 'validation.password.uppercase' })
  .regex(/[a-z]/, { message: 'validation.password.lowercase' })
  .regex(/[0-9]/, { message: 'validation.password.number' });

export const pastDateSchema = z.date().max(new Date(), {
  message: 'validation.date.mustBePast',
});

export const futureDateSchema = z.date().min(new Date(), {
  message: 'validation.date.mustBeFuture',
});

export const urlSchema = z.string().url({ message: 'validation.url.invalid' });

export function stringLength(min?: number, max?: number): z.ZodString {
  let schema = z.string();

  if (isValueDefined(min))
    schema = schema.min(min, { message: 'validation.string.minLength' });

  if (isValueDefined(max))
    schema = schema.max(max, { message: 'validation.string.maxLength' });

  return schema;
}
