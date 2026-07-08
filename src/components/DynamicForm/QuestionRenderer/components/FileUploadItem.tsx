import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FM } from '@/localization/helpers';

import { useTheme } from '../../../../theme/hooks/useTheme';
import { bytesToMb } from '../../questionTypes/fileUploadHelpers';

import type { FileReference } from '../../interfaces';

interface Props {
  file: FileReference;
  index: number;
  onRemove: (objectKey: string) => void;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  info: { flex: 1, marginRight: 12 },
  name: { fontSize: 15 },
  meta: { fontSize: 12, marginTop: 2 },
  removeText: { fontSize: 14, fontWeight: '600' },
});

/** A single uploaded-file row with its name, size, and a remove action. */
export const FileUploadItem: React.FC<Props> = ({ file, index, onRemove }) => {
  const { theme } = useTheme();
  const { colors, semantic } = theme;

  const rowStyle = [styles.row, { borderColor: colors.border, backgroundColor: colors.surface }];
  const nameStyle = [styles.name, { color: colors.text }];
  const metaStyle = [styles.meta, { color: colors.textSecondary }];
  const removeStyle = [styles.removeText, { color: semantic.error['500'] }];

  return (
    <View style={rowStyle}>
      <View style={styles.info}>
        <Text numberOfLines={1} style={nameStyle}>
          {file.fileName}
        </Text>
        <Text style={metaStyle}>{FM('quizActive.fileUpload.fileSize', String(bytesToMb(file.sizeBytes)))}</Text>
      </View>
      <TouchableOpacity
        accessibilityHint={FM('quizActive.fileUpload.removeHint')}
        accessibilityLabel={FM('quizActive.fileUpload.removeLabel', file.fileName)}
        accessibilityRole="button"
        testID={`file-upload-remove-${index}`}
        onPress={() => onRemove(file.objectKey)}
      >
        <Text style={removeStyle}>{FM('quizActive.fileUpload.remove')}</Text>
      </TouchableOpacity>
    </View>
  );
};
