/** New-campaign form: name, subject, body (multiline). */
import React, { useCallback, useMemo, useState } from 'react';

import { TextInput, View } from 'react-native';

import { notifyError, notifySuccess } from '../../../lib/notifications';
import { FM } from '../../../localization/helpers';
import { useCreateCampaign } from '../../../server/customHooks/marketing/useCampaigns';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { isNotEmptyString } from '../../../utils/is';
import { Button } from '../../core/Button';
import ButtonVariant from '../../core/Button/utils/ButtonVariant';
import { marketingStyles } from '../styles';

const CampaignForm = (): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const callbacks = useMemo(() => ({
    onSuccess: () => {
      notifySuccess(FM('marketing.campaigns.createSuccess'));
      setName('');
      setSubject('');
      setBody('');
    },
    onError: () => notifyError(FM('marketing.campaigns.createError')),
  }), []);
  const { mutate, isPending } = useCreateCampaign(callbacks);

  const isValid = isNotEmptyString(name.trim()) && isNotEmptyString(subject.trim()) && isNotEmptyString(body.trim());

  const handleCreate = useCallback((): void => {
    if (!isValid) return;
    mutate({ name: name.trim(), subject: subject.trim(), htmlBody: body });
  }, [isValid, name, subject, body, mutate]);

  const inputStyle = [marketingStyles.input, { borderColor: colors.border, color: colors.text }];

  return (
    <View>
      <TextInput
        accessibilityHint={FM('marketing.campaigns.createButtonHint')}
        accessibilityLabel={FM('marketing.campaigns.namePlaceholder')}
        placeholder={FM('marketing.campaigns.namePlaceholder')}
        placeholderTextColor={colors.textSecondary}
        style={inputStyle}
        testID={TestIds.MARKETING_CAMPAIGN_NAME_INPUT}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        accessibilityHint={FM('marketing.campaigns.createButtonHint')}
        accessibilityLabel={FM('marketing.campaigns.subjectPlaceholder')}
        placeholder={FM('marketing.campaigns.subjectPlaceholder')}
        placeholderTextColor={colors.textSecondary}
        style={inputStyle}
        testID={TestIds.MARKETING_CAMPAIGN_SUBJECT_INPUT}
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        multiline
        accessibilityHint={FM('marketing.campaigns.createButtonHint')}
        accessibilityLabel={FM('marketing.campaigns.bodyPlaceholder')}
        placeholder={FM('marketing.campaigns.bodyPlaceholder')}
        placeholderTextColor={colors.textSecondary}
        style={[inputStyle, marketingStyles.bodyInput]}
        testID={TestIds.MARKETING_CAMPAIGN_BODY_INPUT}
        value={body}
        onChangeText={setBody}
      />
      <View style={marketingStyles.formActions}>
        <Button
          accessibilityHint={FM('marketing.campaigns.createButtonHint')}
          accessibilityLabel={FM('marketing.campaigns.createButton')}
          disabled={!isValid}
          label={FM('marketing.campaigns.createButton')}
          loading={isPending}
          testID={TestIds.MARKETING_CAMPAIGN_CREATE_BUTTON}
          variant={ButtonVariant.Primary}
          onPress={handleCreate}
        />
      </View>
    </View>
  );
};

export default CampaignForm;
