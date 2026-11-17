import React from 'react';

import { render } from '@testing-library/react-native';

import RespondentContactMode from '@/shared/enums/RespondentContactMode';
import { TestIds } from '@/shared/testIds';

import TemplateAvailabilityFields from './TemplateAvailabilityFields';

import type { DateFieldProps } from '@dloizides/ui-forms';

const mockDateFieldProps: DateFieldProps[] = [];

jest.mock('@dloizides/ui-forms', () => ({
  DateField: (props: DateFieldProps) => {
    mockDateFieldProps.push(props);
    return null;
  },
}));

jest.mock('@/theme/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      colors: { text: '#001219', textSecondary: '#555555', surface: '#f7f7f7' },
      palette: { primary: { '500': '#005f73' } },
    },
  }),
}));

const PICKED_ISO = '2026-11-30';

function renderFields(readOnly: boolean, onClosingDateChange: (value: string) => void): DateFieldProps | undefined {
  mockDateFieldProps.length = 0;
  render(
    <TemplateAvailabilityFields
      closingDate="2026-11-01"
      maxResponses=""
      readOnly={readOnly}
      respondentContactMode={RespondentContactMode.Anonymous}
      onClosingDateChange={onClosingDateChange}
      onMaxResponsesChange={jest.fn()}
      onRespondentContactModeChange={jest.fn()}
    />,
  );
  return mockDateFieldProps.at(-1);
}

describe('TemplateAvailabilityFields', () => {
  it('with a date picked in the shared DateField, calls onClosingDateChange with the ISO value', () => {
    const onClosingDateChange = jest.fn();
    const field = renderFields(false, onClosingDateChange);

    field?.onChange(PICKED_ISO);

    expect(field?.testID).toBe(TestIds.TEMPLATE_CLOSING_DATE_INPUT);
    expect(onClosingDateChange).toHaveBeenCalledWith(PICKED_ISO);
  });

  it('when read only, disables the closing date field', () => {
    const field = renderFields(true, jest.fn());

    const disabled = field?.disabled;

    expect(disabled).toBe(true);
  });
});
