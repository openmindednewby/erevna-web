export interface EmbedKind {
  pathSegment: string;
  /** Widget loader data-attribute, e.g. `data-menu-widget`. */
  dataAttr: string;
  /** Widget loader filename served at the origin root, e.g. `widget.js`. */
  widgetFile: string;
  /** postMessage resize event type, e.g. `menu-widget-resize`. */
  resizeMessageType: string;
  /** Human noun used in the iframe title, e.g. `Menu`. */
  titleNoun: string;
  /** data-id attribute name, e.g. `data-menu-id`. */
  idAttr: string;
}

export const MENU_EMBED_KIND: EmbedKind = {
  pathSegment: 'menu',
  dataAttr: 'data-menu-widget',
  widgetFile: 'widget.js',
  resizeMessageType: 'menu-widget-resize',
  titleNoun: 'Menu',
  idAttr: 'data-menu-id',
};

export const SURVEY_EMBED_KIND: EmbedKind = {
  pathSegment: 'survey',
  dataAttr: 'data-survey-widget',
  widgetFile: 'survey-widget.js',
  resizeMessageType: 'survey-widget-resize',
  titleNoun: 'Survey',
  idAttr: 'data-survey-id',
};
