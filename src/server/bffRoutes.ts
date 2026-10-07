const BFF_API_PREFIX = '/bff/api';

export const BFF_API_BASE = {
  /** QuestionerService — quiz templates / answers (erevna's core API). */
  questioner: `${BFF_API_PREFIX}/questioner`,
  /** OnlineMenu API — menu CRUD (shared module). */
  menus: `${BFF_API_PREFIX}/menus`,
  /** ContentService — image / content uploads. */
  content: `${BFF_API_PREFIX}/content`,
  /** TenantService — users, tenants (formerly identity-api). */
  tenants: `${BFF_API_PREFIX}/tenants`,
  /** NotificationService — SMS / email. */
  notifications: `${BFF_API_PREFIX}/notifications`,
  /** PaymentService — billing / subscriptions. */
  payments: `${BFF_API_PREFIX}/payments`,
} as const;
