/** Shared styles for the Marketing campaigns feature. */
import { StyleSheet } from 'react-native';

const CONTAINER_PADDING = 16;
const SECTION_GAP = 16;
const CARD_PADDING = 16;
const CARD_BORDER_RADIUS = 10;
const CARD_BORDER_WIDTH = 1;
const CARD_MARGIN_BOTTOM = 12;
const HEADING_FONT_SIZE = 18;
const SECTION_TITLE_SIZE = 16;
const DESC_FONT_SIZE = 14;
const TITLE_FONT_SIZE = 14;
const SUBTITLE_FONT_SIZE = 13;
const META_FONT_SIZE = 12;
const INPUT_BORDER_RADIUS = 8;
const INPUT_PADDING = 12;
const BODY_INPUT_MIN_HEIGHT = 120;
const REMOVE_BUTTON_PADDING = 8;
const REMOVE_ICON_SIZE = 16;
const BADGE_PADDING_H = 10;
const BADGE_PADDING_V = 4;
const BADGE_BORDER_RADIUS = 12;
const BADGE_FONT_SIZE = 12;

export const marketingStyles = StyleSheet.create({
  container: { flex: 1, padding: CONTAINER_PADDING },
  scrollContent: { paddingBottom: SECTION_GAP },
  heading: { fontSize: HEADING_FONT_SIZE, fontWeight: '700', marginBottom: 4 },
  description: { fontSize: DESC_FONT_SIZE, marginBottom: SECTION_GAP },
  sectionTitle: { fontSize: SECTION_TITLE_SIZE, fontWeight: '700', marginBottom: 8, marginTop: SECTION_GAP },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { padding: CONTAINER_PADDING },

  // Cards / rows
  card: {
    padding: CARD_PADDING,
    borderRadius: CARD_BORDER_RADIUS,
    borderWidth: CARD_BORDER_WIDTH,
    marginBottom: CARD_MARGIN_BOTTOM,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowMain: { flex: 1, marginRight: 8 },
  primaryText: { fontSize: TITLE_FONT_SIZE, fontWeight: '600' },
  secondaryText: { fontSize: SUBTITLE_FONT_SIZE, marginTop: 2 },
  metaText: { fontSize: META_FONT_SIZE, marginTop: 4 },

  // Badge
  badge: { paddingHorizontal: BADGE_PADDING_H, paddingVertical: BADGE_PADDING_V, borderRadius: BADGE_BORDER_RADIUS },
  badgeText: { fontSize: BADGE_FONT_SIZE, fontWeight: '600' },

  // Inputs / forms
  input: {
    borderWidth: 1,
    borderRadius: INPUT_BORDER_RADIUS,
    padding: INPUT_PADDING,
    marginBottom: 8,
    fontSize: TITLE_FONT_SIZE,
  },
  bodyInput: { minHeight: BODY_INPUT_MIN_HEIGHT, textAlignVertical: 'top' },
  formActions: { marginTop: 4, alignSelf: 'flex-start' },

  // Remove button
  removeButton: { padding: REMOVE_BUTTON_PADDING },
  removeIcon: { fontSize: REMOVE_ICON_SIZE, fontWeight: '700' },

  // Send confirm
  confirmRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  cardActions: { marginTop: 8 },
});
