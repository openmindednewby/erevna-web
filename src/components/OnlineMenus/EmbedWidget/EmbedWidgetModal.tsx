import React, { useCallback, useState } from 'react';

import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { FM } from '@/localization/helpers';

import EmbedCodePreview from './components/EmbedCodePreview';
import EmbedConfigPanel from './components/EmbedConfigPanel';
import EmbedTabBar from './components/EmbedTabBar';
import { useEmbedCode } from './hooks/useEmbedCode';
import { DEFAULT_EMBED_HEIGHT, DEFAULT_EMBED_WIDTH } from './utils/embedCodeConstants';
import { MENU_EMBED_KIND, type EmbedKind } from './utils/embedKind';
import { modalStyles } from './utils/embedWidgetStyles';
import EmbedTab from '../../../shared/enums/EmbedTab';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';

import type { EmbedWidgetConfig } from './hooks/useEmbedCode';

interface Props {
  visible: boolean;
  /** Display name shown in the modal title (menu name / survey name). */
  menuName: string;
  publicUrl: string;
  /** External id to embed (menu id / survey id). */
  menuId: string;
  onClose: () => void;
  /** Embed kind — menu by default. Surveys pass SURVEY_EMBED_KIND. */
  kind?: EmbedKind;
  /** Title translation key — defaults to the menu modal title. */
  titleKey?: string;
  /** Modal testID — defaults to the menu embed modal id. */
  modalTestID?: string;
}

const EmbedWidgetModal = ({
  visible,
  menuName,
  publicUrl,
  menuId,
  onClose,
  kind = MENU_EMBED_KIND,
  titleKey = 'onlineMenus.embedWidget.modalTitle',
  modalTestID = TestIds.EMBED_WIDGET_MODAL,
}: Props): React.ReactElement => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [activeTab, setActiveTab] = useState<EmbedTab>(EmbedTab.Iframe);
  const [config, setConfig] = useState<EmbedWidgetConfig>({
    width: DEFAULT_EMBED_WIDTH,
    height: DEFAULT_EMBED_HEIGHT,
    themeOverride: null,
    accentColor: null,
  });

  const { iframeCode, jsCode } = useEmbedCode(config, publicUrl, menuId, kind);

  const handleWidthChange = useCallback((width: string) => {
    setConfig((prev) => ({ ...prev, width }));
  }, []);

  const handleHeightChange = useCallback((height: number) => {
    setConfig((prev) => ({ ...prev, height }));
  }, []);

  const handleThemeChange = useCallback((themeOverride: 'light' | 'dark' | null) => {
    setConfig((prev) => ({ ...prev, themeOverride }));
  }, []);

  const handleAccentColorChange = useCallback((accentColor: string | null) => {
    setConfig((prev) => ({ ...prev, accentColor }));
  }, []);

  const modalTitle = FM(titleKey, menuName);
  const activeCode = activeTab === EmbedTab.Iframe ? iframeCode : jsCode;

  return (
    <Modal
      transparent
      animationType="fade"
      testID={modalTestID}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View
          accessibilityViewIsModal
          aria-label={modalTitle}
          role="dialog"
          style={[modalStyles.content, { backgroundColor: colors.surface }]}
        >
          <View style={[modalStyles.header, { borderBottomColor: colors.border }]}>
            <Text style={[modalStyles.headerTitle, { color: colors.text }]}>{modalTitle}</Text>
            <TouchableOpacity
              accessibilityHint={FM('onlineMenus.embedWidget.closeBtnHint')}
              accessibilityLabel={FM('common.cancel')}
              accessibilityRole="button"
              style={[modalStyles.closeButton, { backgroundColor: colors.border }]}
              testID={TestIds.EMBED_WIDGET_CLOSE_BUTTON}
              onPress={onClose}
            >
              <Text style={[modalStyles.closeText, { color: colors.text }]}>{FM('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
          <View style={modalStyles.body}>
            <EmbedTabBar
              activeColor={theme.palette.primary['500']}
              activeTab={activeTab}
              inactiveColor={String(colors.border)}
              textColor={String(colors.text)}
              onTabChange={setActiveTab}
            />
            <EmbedConfigPanel
              accentColor={config.accentColor}
              activePresetColor={theme.palette.primary['500']}
              borderColor={String(colors.border)}
              height={config.height}
              inactivePresetColor={String(colors.border)}
              inputBackgroundColor={String(colors.surface)}
              textColor={String(colors.text)}
              themeOverride={config.themeOverride}
              width={config.width}
              onAccentColorChange={handleAccentColorChange}
              onHeightChange={handleHeightChange}
              onThemeChange={handleThemeChange}
              onWidthChange={handleWidthChange}
            />
            <EmbedCodePreview
              backgroundColor={String(colors.background)}
              borderColor={String(colors.border)}
              buttonColor={theme.palette.primary['500']}
              buttonTextColor={String(colors.background)}
              code={activeCode}
              textColor={String(colors.text)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EmbedWidgetModal;
