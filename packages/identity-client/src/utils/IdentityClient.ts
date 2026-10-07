import axios, { type AxiosInstance } from 'axios';

import {
  handleLoginError,
  handleOtpError,
  handleVerifyError,
  handleRefreshError,
  handleLogoutError,
  handleRegisterError,
  createError,
} from './errorHandlers';
import { normalizeRegisterResponse } from './normalizeRegisterResponse';
import {
  AuthMethod,
  OtpType,
  type IdentityClientConfig,
  type LoginRequest,
  type LoginResponse,
  type SendOtpRequest,
  type SendOtpResponse,
  type VerifyOtpRequest,
  type VerifyOtpResponse,
  type RefreshRequest,
  type RefreshResponse,
  type LogoutRequest,
  type LogoutResponse,
  type GetAuthMethodsResponse,
  type RegisterRequest,
} from '../types';

const DEFAULT_TIMEOUT_MS = 30000;

export class IdentityClient {
  private axios: AxiosInstance;
  private baseUrl: string;
  private realm: string | null;

  constructor(config: IdentityClientConfig) {
    this.baseUrl = config.baseUrl;
    const realmValue = typeof config.realm === 'string' && config.realm.length > 0 ? config.realm : null;
    this.realm = realmValue;
    const timeout = typeof config.timeout === 'number' ? config.timeout : DEFAULT_TIMEOUT_MS;
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (typeof realmValue === 'string') baseHeaders['X-Realm'] = realmValue;
    this.axios = axios.create({
      baseURL: config.baseUrl,
      timeout,
      headers: baseHeaders,
    });
  }

  async register(body: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await this.axios.post<LoginResponse>('/auth/register', body);
      return normalizeRegisterResponse(response.data);
    } catch (error) {
      throw handleRegisterError(error);
    }
  }

  async loginWithPassword(
    username: string,
    password: string,
    tenantId?: string
  ): Promise<LoginResponse> {
    try {
      const request: LoginRequest = {
        method: AuthMethod.UsernamePassword,
        username,
        password,
        tenantId,
      };
      const response = await this.axios.post<LoginResponse>('/auth/login', request);
      return response.data;
    } catch (error) {
      return handleLoginError(error);
    }
  }

  async loginWithPhoneOtp(
    phoneNumber: string,
    otpCode: string,
    tenantId?: string
  ): Promise<LoginResponse> {
    try {
      const request: LoginRequest = {
        method: AuthMethod.PhoneOtp,
        phoneNumber,
        otpCode,
        tenantId,
      };
      const response = await this.axios.post<LoginResponse>('/auth/login', request);
      return response.data;
    } catch (error) {
      return handleLoginError(error);
    }
  }

  async loginWithEmailOtp(
    email: string,
    otpCode: string,
    tenantId?: string
  ): Promise<LoginResponse> {
    try {
      const request: LoginRequest = {
        method: AuthMethod.EmailOtp,
        email,
        otpCode,
        tenantId,
      };
      const response = await this.axios.post<LoginResponse>('/auth/login', request);
      return response.data;
    } catch (error) {
      return handleLoginError(error);
    }
  }

  async sendPhoneOtp(phoneNumber: string, tenantId?: string): Promise<SendOtpResponse> {
    try {
      const request: SendOtpRequest = {
        type: OtpType.Sms,
        identifier: phoneNumber,
        tenantId,
      };
      const response = await this.axios.post<SendOtpResponse>('/auth/send-otp', request);
      return response.data;
    } catch (error) {
      return handleOtpError(error);
    }
  }

  async sendEmailOtp(email: string, tenantId?: string): Promise<SendOtpResponse> {
    try {
      const request: SendOtpRequest = {
        type: OtpType.Email,
        identifier: email,
        tenantId,
      };
      const response = await this.axios.post<SendOtpResponse>('/auth/send-otp', request);
      return response.data;
    } catch (error) {
      return handleOtpError(error);
    }
  }

  async verifyOtp(
    identifier: string,
    code: string,
    tenantId?: string
  ): Promise<VerifyOtpResponse> {
    try {
      const request: VerifyOtpRequest = {
        identifier,
        code,
        tenantId,
      };
      const response = await this.axios.post<VerifyOtpResponse>('/auth/verify-otp', request);
      return response.data;
    } catch (error) {
      return handleVerifyError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    try {
      const request: RefreshRequest = {
        refreshToken,
      };
      const response = await this.axios.post<RefreshResponse>('/auth/refresh', request);
      return response.data;
    } catch (error) {
      return handleRefreshError(error);
    }
  }

  async logout(accessToken: string): Promise<LogoutResponse> {
    try {
      const request: LogoutRequest = {
        token: accessToken,
      };
      const response = await this.axios.post<LogoutResponse>('/auth/logout', request);
      return response.data;
    } catch (error) {
      return handleLogoutError(error);
    }
  }

  async getAuthMethods(
    tenantId?: string,
    tenantSlug?: string
  ): Promise<GetAuthMethodsResponse> {
    try {
      const params: Record<string, string> = {};
      if (typeof tenantId === 'string' && tenantId !== '') params.tenantId = tenantId;
      if (typeof tenantSlug === 'string' && tenantSlug !== '') params.tenantSlug = tenantSlug;
      const response = await this.axios.get<GetAuthMethodsResponse>('/auth/methods', { params });
      return response.data;
    } catch (error) {
      throw createError(error);
    }
  }
}

