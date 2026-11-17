import React from 'react';

import { act, render } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';

import { FormNativeDatePicker } from './FormNativeDatePicker';

import type { DateFieldProps } from '@dloizides/ui-forms';

const mockDateFieldProps: DateFieldProps[] = [];

jest.mock('@dloizides/ui-forms', () => ({
  DateField: (props: DateFieldProps) => {
    mockDateFieldProps.push(props);
    return null;
  },
}));

const PICKED_ISO = '2026-11-30';

interface DateForm {
  due: string;
}

function Harness({ onValues }: { onValues: (read: () => DateForm) => void }): React.ReactElement {
  const { control, getValues } = useForm<DateForm>({ defaultValues: { due: '' } });
  onValues(getValues);
  return <FormNativeDatePicker accessibilityHint="hint" control={control} label="Due" name="due" testID="due-date" />;
}

describe('FormNativeDatePicker', () => {
  it('with a date picked in the shared DateField, writes the ISO value into the form field', () => {
    let readValues: () => DateForm = () => ({ due: '' });
    mockDateFieldProps.length = 0;
    render(<Harness onValues={(read) => { readValues = read; }} />);

    act(() => mockDateFieldProps.at(-1)?.onChange(PICKED_ISO));

    expect(readValues().due).toBe(PICKED_ISO);
  });
});
