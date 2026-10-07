import type { AuthMethod } from './utils/AuthMethod';
import type { OtpType } from './utils/OtpType';

export { AuthMethod } from './utils/AuthMethod';
export { OtpType } from './utils/OtpType';

export interface UserInfo {
  sub: string;
  username?: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  preferredUsername?: string;
  roles?: string[];
  tenantId?: string;
  customClaims?: Record<string, unknown>;
}

export interface LoginRequest {
  method: AuthMethod;
  username?: string;
  password?: string;
  phoneNumber?: string;
  email?: string;
  otpCode?: string;
  tenantId?: string;
}

export interface LoginResponse {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number;
  userInfo: UserInfo | null;
  errorMessage?: string;
  errorCode?: string;
}

export interface SendOtpRequest {
  type: OtpType;
  identifier: string;
  tenantId?: string;
}

export interface SendOtpResponse {
  success: boolean;
  expiresIn: number;
  code?: string | null;
  smsSent: boolean;
  errorMessage?: string;
  errorCode?: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  code: string;
  tenantId?: string;
}

export interface VerifyOtpResponse {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number;
  userInfo: UserInfo | null;
  errorMessage?: string;
  errorCode?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number;
  errorMessage?: string;
  errorCode?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantName: string;
}

export interface RegisterErrorField {
  field: string;
  message: string;
}

export interface RegisterErrorShape {
  errorCode: string;
  message: string;
  fieldErrors: RegisterErrorField[];
}

export interface LogoutRequest {
  token: string;
}

export interface LogoutResponse {
  success: boolean;
  errorMessage?: string | null;
}

export interface GetAuthMethodsResponse {
  primaryMethod: AuthMethod;
  allowedMethods: AuthMethod[];
  otpCodeLength: number;
  otpExpiryMinutes: number;
  requireSmsVerification: boolean;
}

export interface IdentityClientConfig {
  baseUrl: string;
  timeout?: number;
  realm?: string;
}
