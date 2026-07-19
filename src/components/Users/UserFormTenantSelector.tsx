import React from 'react';

import { StyleSheet, View } from 'react-native';

import { FM } from '@/localization/helpers';

import { useTheme } from '../../theme/hooks/useTheme';
import { ChipSelector, Field } from '../Forms';

interface TenantOption {
  id: string;
  name: string;
}

const styles = StyleSheet.create({
  tenantSelectorCard: { borderRadius: 8, borderWidth: 1, padding: 8 },
});

interface UserFormTenantSelectorProps {
  tenants: TenantOption[];
  selectedTenantId: string;
  onSelectTenant: (id: string) => void;
  disabled: boolean;
}

const UserFormTenantSelector: React.FC<UserFormTenantSelectorProps> = ({
  tenants,
  selectedTenantId,
  onSelectTenant,
  disabled,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const tenantOptions = tenants.map((tenant) => ({ value: tenant.id, label: tenant.name }));

  // `Field` supplies the label row, the required mark and the 16px bottom margin, so this
  // selector lines up with the `FormField`s beside it instead of the hand-rolled label it
  // used to carry. The required mark is also decorative to a screen reader now — it hears
  // "required" via aria-required rather than reading out the literal marker text.
  return (
    <Field required label={FM('common.tenant')}>
      <View style={[styles.tenantSelectorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/*
          `spacing="gap"` drops Field's default 16px bottom margin. This selector is the sole
          child of the bordered card above, so that margin would render as dead space inside
          the card; the enclosing section supplies the real spacing. Same pixels as the
          `marginBottom: 0` override it replaces, but stated as intent rather than a style
          patch that a reader has to reverse-engineer.
        */}
        <ChipSelector disabled={disabled} options={tenantOptions} spacing="gap" value={selectedTenantId} onChange={onSelectTenant} />
      </View>
    </Field>
  );
};

export default UserFormTenantSelector;
