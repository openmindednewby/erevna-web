import RespondentContactMode from '@/shared/enums/RespondentContactMode';

import { collectsRespondentContact, validateRespondentContact } from './respondentContact';

describe('validateRespondentContact', () => {
  it('Anonymous never errors', () => {
    expect(validateRespondentContact(RespondentContactMode.Anonymous, '', '')).toBeNull();
  });

  it('Optional with no contact is fine', () => {
    expect(validateRespondentContact(RespondentContactMode.Optional, '', '')).toBeNull();
  });

  it('Optional with bad email flags email', () => {
    expect(validateRespondentContact(RespondentContactMode.Optional, '', 'nope')).toBe('email');
  });

  it('Optional with good email is fine', () => {
    expect(validateRespondentContact(RespondentContactMode.Optional, '', 'a@b.co')).toBeNull();
  });

  it('Required missing name flags name first', () => {
    expect(validateRespondentContact(RespondentContactMode.Required, '  ', 'a@b.co')).toBe('name');
  });

  it('Required missing email flags email', () => {
    expect(validateRespondentContact(RespondentContactMode.Required, 'Jane', '')).toBe('email');
  });

  it('Required with name + valid email is fine', () => {
    expect(validateRespondentContact(RespondentContactMode.Required, 'Jane', 'jane@example.com')).toBeNull();
  });
});

describe('collectsRespondentContact', () => {
  it('true for Optional/Required, false otherwise', () => {
    expect(collectsRespondentContact(RespondentContactMode.Optional)).toBe(true);
    expect(collectsRespondentContact(RespondentContactMode.Required)).toBe(true);
    expect(collectsRespondentContact(RespondentContactMode.Anonymous)).toBe(false);
    expect(collectsRespondentContact(undefined)).toBe(false);
  });
});
