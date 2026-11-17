import React from 'react';

import { render } from '@testing-library/react-native';

import { DateQuestion } from './DateQuestion';

import type { DateFieldProps } from '@dloizides/ui-forms';

const mockDateFieldProps: DateFieldProps[] = [];

jest.mock('@dloizides/ui-forms', () => ({
  DateField: (props: DateFieldProps) => {
    mockDateFieldProps.push(props);
    return null;
  },
}));

const PICKED_ISO = '2026-11-30';

function renderQuestion(errorMsg: string | undefined, updateAnswer: (value: string) => void): DateFieldProps | undefined {
  mockDateFieldProps.length = 0;
  render(<DateQuestion errorMsg={errorMsg} updateAnswer={updateAnswer} value="" />);
  return mockDateFieldProps.at(-1);
}

describe('DateQuestion', () => {
  it('with a date picked in the shared DateField, calls updateAnswer with the ISO value', () => {
    const updateAnswer = jest.fn();
    const field = renderQuestion(undefined, updateAnswer);

    field?.onChange(PICKED_ISO);

    expect(updateAnswer).toHaveBeenCalledWith(PICKED_ISO);
  });

  it('with an error message, shows it on the date field', () => {
    const errorMsg = 'Pick a date';

    const field = renderQuestion(errorMsg, jest.fn());

    expect(field?.error).toBe(errorMsg);
  });
});
