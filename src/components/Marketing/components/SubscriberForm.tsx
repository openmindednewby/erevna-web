/** Add-subscriber form: email (required) + optional name. */
import React, { useCallback, useMemo, useState } from 'react';

import { TextInput, View } from 'react-native';

import { notifyError, notifySuccess } from '../../../lib/notifications';
import { FM } from '../../../localization/helpers';
import { useCreateSubscriber } from '../../../server/customHooks/marketing/useSubscribers';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { isNotEmptyString } from '../../../utils/is';
import { Button } from '../../core/Button';
import ButtonVariant from '../../core/Button/utils/ButtonVariant';
import { marketingStyles } from '../styles';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SubscriberForm = (): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const callbacks = useMemo(() => ({
    onSuccess: () => {
      notifySuccess(FM('marketing.subscribers.addSuccess'));
      setEmail('');
      setName('');
    },
    onError: () => notifyError(FM('marketing.subscribers.addError')),
  }), []);
  const { mutate, isPending } = useCreateSubscriber(callbacks);

  const handleAdd = useCallback((): void => {
    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      notifyError(FM('marketing.subscribers.invalidEmail'));
      return;
    }
    const trimmedName = name.trim();
    mutate({
      email: trimmedEmail,
      name: isNotEmptyString(trimmedName) ? trimmedName : undefined,
    });
  }, [email, name, mutate]);

  const inputStyle = [marketingStyles.input, { borderColor: colors.border, color: colors.text }];

  return (
    <View>
      <TextInput
        accessibilityHint={FM('marketing.subscribers.addButtonHint')}
        accessibilityLabel={FM('marketing.subscribers.emailPlaceholder')}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder={FM('marketing.subscribers.emailPlaceholder')}
        placeholderTextColor={colors.textSecondary}
        style={inputStyle}
        testID={TestIds.MARKETING_SUBSCRIBER_EMAIL_INPUT}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        accessibilityHint={FM('marketing.subscribers.addButtonHint')}
        accessibilityLabel={FM('marketing.subscribers.namePlaceholder')}
        placeholder={FM('marketing.subscribers.namePlaceholder')}
        placeholderTextColor={colors.textSecondary}
        style={inputStyle}
        testID={TestIds.MARKETING_SUBSCRIBER_NAME_INPUT}
        value={name}
        onChangeText={setName}
      />
      <View style={marketingStyles.formActions}>
        <Button
          accessibilityHint={FM('marketing.subscribers.addButtonHint')}
          accessibilityLabel={FM('marketing.subscribers.addButton')}
          label={FM('marketing.subscribers.addButton')}
          loading={isPending}
          testID={TestIds.MARKETING_SUBSCRIBER_ADD_BUTTON}
          variant={ButtonVariant.Primary}
          onPress={handleAdd}
        />
      </View>
    </View>
  );
};

export default SubscriberForm;
