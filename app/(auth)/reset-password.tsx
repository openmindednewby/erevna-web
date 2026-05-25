/**
 * Reset-password landing page (`/reset-password?token=…`).
 *
 * Reachable while logged out — the route lives under the `(auth)` group which
 * does not gate on session state. The token comes from the email-link query
 * param; on mount we read it once and pass it to `useResetPasswordForm`.
 *
 * On success: navigates to the login screen and emits a success notification.
 * On expired / invalid token (HTTP 400): swaps the form for a CTA that returns
 * the user to login (where they can request a new link).
 */
import React, { useCallback, useMemo } from 'react';

import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { useResetPasswordForm, ResetPasswordError } from '../../src/auth/useResetPasswordForm';
import SaveButton from '../../src/components/Buttons/SaveButton';
import { notifySuccess } from '../../src/lib/notifications';
import { FM } from '../../src/localization/helpers';
import { useTheme } from '../../src/theme/hooks/useTheme';
import { isValueDefined } from '../../src/utils/is';

const BOX_SHADOW = '0px 2px 8px rgba(0, 0, 0, 0.1)';
const ERROR_RED = '#d33';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    boxShadow: BOX_SHADOW,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  buttonContainer: { marginTop: 8, marginBottom: 16 },
  errorMessage: { color: ERROR_RED, marginBottom: 16, lineHeight: 22 },
  policyNote: { fontSize: 13, marginBottom: 16, lineHeight: 18 },
});

function readQueryToken(raw: string | string[] | undefined): string {
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw) && typeof raw[0] === 'string') return raw[0];
  return '';
}

function errorMessage(errorKey: ResetPasswordError | null): string {
  if (!isValueDefined(errorKey)) return '';
  if (errorKey === ResetPasswordError.Empty) return FM('resetPassword.errors.empty');
  if (errorKey === ResetPasswordError.WeakPassword) return FM('resetPassword.errors.weakPassword');
  if (errorKey === ResetPasswordError.Mismatch) return FM('resetPassword.errors.mismatch');
  if (errorKey === ResetPasswordError.TokenInvalid) return FM('resetPassword.errors.tokenInvalid');
  return FM('resetPassword.errors.network');
}

const ResetPasswordScreen = (): React.ReactElement => {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const token = readQueryToken(params.token);
  const { theme } = useTheme();
  const { colors } = theme;
  const primaryColor = theme.palette.primary['500'];

  const onSuccess = useCallback((): void => {
    notifySuccess(FM('resetPassword.successToast'));
    router.replace('/(auth)/login');
  }, [router]);

  const formArgs = useMemo(() => ({ token, onSuccess }), [token, onSuccess]);
  const form = useResetPasswordForm(formArgs);

  const containerStyle = [styles.container, { backgroundColor: colors.background }];
  const formContainerStyle = [styles.formContainer, { backgroundColor: colors.surface }];
  const titleStyle = [styles.title, { color: colors.text }];
  const subtitleStyle = [styles.subtitle, { color: colors.textSecondary }];
  const labelStyle = [styles.label, { color: colors.text }];
  const inputStyle = [styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text }];
  const policyNoteStyle = [styles.policyNote, { color: colors.textSecondary }];

  if (form.hasInvalidToken) 
    return (
      <View style={containerStyle}>
        <View style={formContainerStyle} testID="reset-password-invalid">
          <Text style={titleStyle}>{FM('resetPassword.invalidTitle')}</Text>
          <Text style={subtitleStyle}>{FM('resetPassword.invalidMessage')}</Text>
          <View style={styles.buttonContainer}>
            <SaveButton
              testID="reset-password-request-new"
              title={FM('resetPassword.requestNew')}
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>
        </View>
      </View>
    );
  

  return (
    <View style={containerStyle}>
      <View style={formContainerStyle} testID="reset-password-form">
        <Text style={titleStyle}>{FM('resetPassword.title')}</Text>
        <Text style={subtitleStyle}>{FM('resetPassword.subtitle')}</Text>
        <Text style={policyNoteStyle}>{FM('resetPassword.policyNote')}</Text>

        <View style={styles.inputContainer}>
          <Text style={labelStyle}>{FM('resetPassword.newPasswordLabel')}</Text>
          <TextInput
            secureTextEntry
            accessibilityHint={FM('resetPassword.newPasswordHint')}
            accessibilityLabel={FM('resetPassword.newPasswordInputLabel')}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!form.isSubmitting}
            placeholder={FM('resetPassword.newPasswordPlaceholder')}
            style={inputStyle}
            testID="reset-password-new-input"
            value={form.newPassword}
            onChangeText={form.setNewPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={labelStyle}>{FM('resetPassword.confirmPasswordLabel')}</Text>
          <TextInput
            secureTextEntry
            accessibilityHint={FM('resetPassword.confirmPasswordHint')}
            accessibilityLabel={FM('resetPassword.confirmPasswordInputLabel')}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!form.isSubmitting}
            placeholder={FM('resetPassword.confirmPasswordPlaceholder')}
            style={inputStyle}
            testID="reset-password-confirm-input"
            value={form.confirmPassword}
            onChangeText={form.setConfirmPassword}
          />
        </View>

        {isValueDefined(form.errorKey) ? (
          <Text style={styles.errorMessage} testID="reset-password-error">
            {errorMessage(form.errorKey)}
          </Text>
        ) : null}

        <View style={styles.buttonContainer}>
          {form.isSubmitting ? (
            <ActivityIndicator color={primaryColor} size="large" />
          ) : (
            <SaveButton
              testID="reset-password-submit"
              title={FM('resetPassword.submit')}
              onPress={form.submit}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;
