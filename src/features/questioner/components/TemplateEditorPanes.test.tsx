/**
 * Tests for TemplateEditorPanes — the additive desktop two-pane wrapper.
 *
 * Logic under test: the width-gated branch. Below TWO_PANE_MIN_WIDTH_PX the children
 * (editor form) render alone with no preview pane; at/above it the live preview pane
 * is added. TemplateLivePreview is mocked to a light stub so this stays a logic test
 * (no heavy respondent fill stack).
 */
import React from 'react';

import { render } from '@testing-library/react-native';

import TemplateEditorPanes from './TemplateEditorPanes';
import { TWO_PANE_MIN_WIDTH_PX } from '../../../shared/constants';
import { TestIds } from '../../../shared/testIds';

// Partial mock: override only useWindowDimensions, keep every other RN export real.
// A Proxy avoids eagerly evaluating unrelated getters (e.g. the mocked Modal).
const mockWindowDimensions = jest.fn();
jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return new Proxy(actual, {
    get: (target, prop) =>
      (prop === 'useWindowDimensions' ? mockWindowDimensions : Reflect.get(target, prop)),
  });
});

jest.mock('./TemplateLivePreview', () => {
  const { View } = jest.requireActual('react-native');
  const { TestIds: RealTestIds } = jest.requireActual('../../../shared/testIds');
  const MockPreview = (): React.ReactElement => <View testID={RealTestIds.TEMPLATE_EDITOR_LIVE_PANE} />;
  return MockPreview;
});

const NARROW_WIDTH = 1024;
const WINDOW_HEIGHT = 900;

function renderPanes(): ReturnType<typeof render> {
  const { Text } = jest.requireActual('react-native');
  return render(
    <TemplateEditorPanes description="d" name="n" questions={[]}>
      <Text testID="editor-form-child">form</Text>
    </TemplateEditorPanes>,
  );
}

describe('TemplateEditorPanes', () => {
  afterEach(() => mockWindowDimensions.mockReset());

  it('renders only the children (no preview pane) below the breakpoint', () => {
    mockWindowDimensions.mockReturnValue({ width: NARROW_WIDTH, height: WINDOW_HEIGHT });
    const { getByTestId, queryByTestId } = renderPanes();
    expect(getByTestId('editor-form-child')).toBeTruthy();
    expect(queryByTestId(TestIds.TEMPLATE_EDITOR_LIVE_PANE)).toBeNull();
  });

  it('renders the children and the live preview pane at the breakpoint', () => {
    mockWindowDimensions.mockReturnValue({ width: TWO_PANE_MIN_WIDTH_PX, height: WINDOW_HEIGHT });
    const { getByTestId } = renderPanes();
    expect(getByTestId('editor-form-child')).toBeTruthy();
    expect(getByTestId(TestIds.TEMPLATE_EDITOR_LIVE_PANE)).toBeTruthy();
  });
});
