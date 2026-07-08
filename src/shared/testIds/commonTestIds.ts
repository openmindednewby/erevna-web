/**
 * Test IDs for common/shared UI components, login, navigation, and loading states.
 * Split from testIds.ts to keep file sizes under 200 lines.
 */

export const CommonTestIds = {
  // Template components
  TEMPLATE_LIST: 'template-list',
  TEMPLATE_MODAL: 'template-modal',
  CREATE_TEMPLATE_FORM: 'create-template-form',
  TEMPLATE_NAME_INPUT: 'template-name-input',
  TEMPLATE_STATUS_ACTIVE_BUTTON: 'template-status-active-button',
  TEMPLATE_STATUS_INACTIVE_BUTTON: 'template-status-inactive-button',
  TEMPLATE_CLOSING_DATE_INPUT: 'template-closing-date-input',
  TEMPLATE_MAX_RESPONSES_INPUT: 'template-max-responses-input',
  TEMPLATE_CONTACT_MODE_ANONYMOUS: 'template-contact-mode-anonymous',
  TEMPLATE_CONTACT_MODE_OPTIONAL: 'template-contact-mode-optional',
  TEMPLATE_CONTACT_MODE_REQUIRED: 'template-contact-mode-required',

  // Generic list item (used by TenantListItem for various entity types)
  TENANT_LIST_ITEM: 'tenant-list-item',
  TENANT_LIST_ITEM_VIEW_BUTTON: 'tenant-list-item-view-button',

  // Tenant Selector (User Management)
  TENANT_SELECTOR_ALL_USERS: 'tenant-selector-all-users',
  TENANT_SELECTOR_ITEM: 'tenant-selector-item',

  // Text elements
  HEADING_TEXT: 'heading-text',
  STATUS_LABEL: 'status-label',

  // Login page — render-side IDs come from `@dloizides/auth-web`'s `<LoginForm>`
  // after the Phase 5 cutover. App code that wants to reference the form (e.g.
  // E2E tests) should read these constants — they're kept in sync with the
  // `AuthTestIds` defaults the shared component renders.
  LOGIN_FORM: 'auth-login-form',
  USERNAME_INPUT: 'auth-login-username',
  PASSWORD_INPUT: 'auth-login-password',
  LOGIN_BUTTON: 'auth-login-submit',
  LOGIN_SIGN_UP_LINK: 'login-sign-up-link',

  // Register page
  REGISTER_FORM: 'register-form',
  REGISTER_FIRST_NAME_INPUT: 'register-first-name-input',
  REGISTER_LAST_NAME_INPUT: 'register-last-name-input',
  REGISTER_USERNAME_INPUT: 'register-username-input',
  REGISTER_EMAIL_INPUT: 'register-email-input',
  REGISTER_PASSWORD_INPUT: 'register-password-input',
  REGISTER_CONFIRM_PASSWORD_INPUT: 'register-confirm-password-input',
  REGISTER_TENANT_NAME_INPUT: 'register-tenant-name-input',
  REGISTER_SUBMIT_BUTTON: 'register-submit-button',
  REGISTER_SIGN_IN_LINK: 'register-sign-in-link',

  // Verify-email page (POST /bff/verify-email, surfaced via /verify-email?token=…)
  VERIFY_EMAIL_PAGE: 'verify-email-page',
  VERIFY_EMAIL_LOADING: 'verify-email-loading',
  VERIFY_EMAIL_SUCCESS: 'verify-email-success',
  VERIFY_EMAIL_ERROR: 'verify-email-error',
  VERIFY_EMAIL_SUCCESS_CONTINUE: 'verify-email-success-continue',
  VERIFY_EMAIL_RESEND_CTA: 'verify-email-resend-cta',
  VERIFY_EMAIL_RESEND_FORM: 'verify-email-resend-form',
  VERIFY_EMAIL_RESEND_EMAIL: 'verify-email-resend-email',
  VERIFY_EMAIL_RESEND_SUBMIT: 'verify-email-resend-submit',
  VERIFY_EMAIL_RESEND_CONFIRMATION: 'verify-email-resend-confirmation',

  // Verification-pending banner (mounted on the authenticated layout)
  VERIFICATION_PENDING_BANNER: 'verification-pending-banner',
  VERIFICATION_PENDING_RESEND_BUTTON: 'verification-pending-resend-button',
  VERIFICATION_PENDING_RESEND_CONFIRMATION: 'verification-pending-resend-confirmation',

  // Navigation & Layout
  NAV_MENU: 'nav-menu',
  LOGOUT_BUTTON: 'logout-button',
  DRAWER_CLOSE_BUTTON: 'drawer-close-button',
  DRAWER_BACKDROP: 'drawer-backdrop',
  DRAWER_ACCOUNT_BUTTON: 'drawer-account-button',
  DRAWER_LANGUAGE_SELECTOR: 'drawer-language-selector',
  LAYOUT_CLOSE_SIDEBAR_OVERLAY: 'layout-close-sidebar-overlay',

  // Common actions
  EDIT_BUTTON: 'edit-button',
  DELETE_BUTTON: 'delete-button',
  SAVE_BUTTON: 'save-button',
  CANCEL_BUTTON: 'cancel-button',
  ACTIVATE_BUTTON: 'activate-button',
  DELETE_INACTIVE_BUTTON: 'delete-inactive-button',

  // Confirm dialog
  CONFIRM_DIALOG: 'confirm-dialog',
  CONFIRM_BUTTON: 'confirm-button',
  CANCEL_CONFIRM_BUTTON: 'cancel-confirm-button',

  // Loading states
  LOADING_INDICATOR: 'loading-indicator',

  // Quiz pages
  QUIZ_ACTIVE_PAGE: 'quiz-active-page',
  QUIZ_ANSWERS_PAGE: 'quiz-answers-page',
  QUIZ_TEMPLATES_PAGE: 'quiz-templates-page',
  QUIZ_TEMPLATE_QR_CODE_BUTTON: 'quiz-template-qr-code-button',

  // Quiz analytics
  QUIZ_ANALYTICS_PAGE: 'quiz-analytics-page',
  QUIZ_ANALYTICS_LOADING: 'quiz-analytics-loading',
  QUIZ_ANALYTICS_EMPTY: 'quiz-analytics-empty',
  QUIZ_ANALYTICS_STAT_TOTAL: 'quiz-analytics-stat-total',
  QUIZ_ANALYTICS_TIMELINE: 'quiz-analytics-timeline',
  QUIZ_ANALYTICS_OPTION_CHART: 'quiz-analytics-option-chart',
  QUIZ_ANALYTICS_TEXT_LIST: 'quiz-analytics-text-list',
  QUIZ_ANALYTICS_NUMERIC_SUMMARY: 'quiz-analytics-numeric-summary',
  QUIZ_ANALYTICS_DATE_LIST: 'quiz-analytics-date-list',
  QUIZ_ANALYTICS_FUNNEL: 'quiz-analytics-funnel',
  QUIZ_ANALYTICS_CROSSTAB: 'quiz-analytics-crosstab',
  QUIZ_ANALYTICS_CROSSTAB_ROW_PICKER: 'quiz-analytics-crosstab-row-picker',
  QUIZ_ANALYTICS_CROSSTAB_COL_PICKER: 'quiz-analytics-crosstab-col-picker',
  QUIZ_ANALYTICS_CROSSTAB_ROW_OPTION: 'quiz-analytics-crosstab-row-option',
  QUIZ_ANALYTICS_CROSSTAB_COL_OPTION: 'quiz-analytics-crosstab-col-option',

  // Public survey respondent page
  PUBLIC_SURVEY_PAGE: 'public-survey-page',
  PUBLIC_SURVEY_LOADING: 'public-survey-loading',
  PUBLIC_SURVEY_UNAVAILABLE: 'public-survey-unavailable',
  PUBLIC_SURVEY_CLOSED: 'public-survey-closed',
  PUBLIC_SURVEY_ERROR: 'public-survey-error',
  PUBLIC_SURVEY_RESPONDENT_NAME: 'public-survey-respondent-name',
  PUBLIC_SURVEY_RESPONDENT_EMAIL: 'public-survey-respondent-email',
  PUBLIC_SURVEY_SAVE_DRAFT_BUTTON: 'public-survey-save-draft-button',
  PUBLIC_SURVEY_RESUME_LINK: 'public-survey-resume-link',

  // Shared UI Components
  TAB_CONTAINER: 'tab-container',
  TAB_BUTTON: 'tab-button',
  CHOICE_PILL: 'choice-pill',
  CHECKBOX: 'checkbox',
  FORM_FIELD_INPUT: 'form-field-input',
  FORM_SWITCH: 'form-switch',
  CHIP_SELECTOR_CHIP: 'chip-selector-chip',

  // Error / Loading States
  ERROR_BOUNDARY_RETRY_BUTTON: 'error-boundary-retry-button',
  ERROR_BOUNDARY_RELOAD_BUTTON: 'error-boundary-reload-button',
  ERROR_BOUNDARY_UPDATING: 'error-boundary-updating',
  ERROR_STATE: 'error-state',
  ERROR_STATE_RETRY: 'error-state-retry',
  LOADING_FALLBACK: 'loading-fallback',
  PAGE_SKELETON: 'page-skeleton',

  // API Error Modal
  API_ERROR_MODAL: 'api-error-modal',
  API_ERROR_MODAL_TITLE: 'api-error-modal-title',
  API_ERROR_MODAL_MESSAGE: 'api-error-modal-message',
  API_ERROR_MODAL_CLOSE: 'api-error-modal-close',
  API_ERROR_MODAL_ACTION: 'api-error-modal-action',

  // Page retry buttons
  TENANTS_RETRY_BUTTON: 'tenants-retry-button',
  USERS_RETRY_BUTTON: 'users-retry-button',

  // PWA Install Prompts
  PWA_INSTALL_PROMPT: 'pwa-install-prompt',
  PWA_INSTALL_BUTTON: 'pwa-install-button',
  PWA_CANCEL_BUTTON: 'pwa-cancel-button',
  IOS_ADD_HOME_PROMPT: 'ios-add-home-prompt',
  IOS_ADD_HOME_BUTTON: 'ios-add-home-button',

  // Inline Editable Text
  INLINE_EDIT_DISPLAY: 'inline-edit-display',
  INLINE_EDIT_INPUT: 'inline-edit-input',

  // Offline Banner
  OFFLINE_BANNER: 'offline-banner',
  OFFLINE_BANNER_DISMISS: 'offline-banner-dismiss',
} as const;
