import type { ReactElement } from 'react';

import { DateField } from '@dloizides/ui-forms';
import { Controller } from 'react-hook-form';

import { isValueDefined } from '../../../shared/utils/validators';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  accessibilityHint: string;
  testID: string;
  min?: string;
  max?: string;
  disabled?: boolean;
}

export const FormNativeDatePicker = <T extends FieldValues>({
  name,
  control,
  label,
  accessibilityHint,
  testID,
  min,
  max,
  disabled,
}: Props<T>): ReactElement => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState, formState }) => {
      const showError = (fieldState.isTouched || formState.isSubmitted) && isValueDefined(fieldState.error);
      return (
        <DateField
          accessibilityHint={accessibilityHint}
          disabled={disabled}
          error={showError ? fieldState.error?.message : undefined}
          label={label}
          max={max}
          min={min}
          testID={testID}
          value={String(field.value ?? '')}
          onChange={(next) => {
            field.onChange(next);
            field.onBlur();
          }}
        />
      );
    }}
  />
);
