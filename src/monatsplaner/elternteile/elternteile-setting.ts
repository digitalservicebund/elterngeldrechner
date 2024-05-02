import { ElternteilType, Geburtstag } from "./elternteile-types";

interface BaseSettings {
  readonly mehrlinge: boolean;
  readonly behindertesGeschwisterkind: boolean;
}

export interface MutterschutzSettings {
  readonly endDate: string;
  readonly elternteil: ElternteilType;
}

interface CreateWithPartnermonateSettings extends BaseSettings {
  readonly partnerMonate: boolean;
}

interface CreateWithFruehchenSettings extends BaseSettings {
  readonly geburtstag: Geburtstag;
}

interface CreateWithMutterschutzSettings extends CreateWithFruehchenSettings {
  readonly mutterschutz: MutterschutzSettings;
}

interface CreateWithMutterschutzAndPartnermonateSettings
  extends CreateWithMutterschutzSettings,
    CreateWithPartnermonateSettings {}

interface CreateWithFruehchenAndPartnermonateSettings
  extends CreateWithFruehchenSettings,
    CreateWithPartnermonateSettings {}

export type CreateElternteileSettings =
  | CreateWithPartnermonateSettings
  | CreateWithMutterschutzSettings
  | CreateWithFruehchenSettings
  | CreateWithMutterschutzAndPartnermonateSettings
  | CreateWithFruehchenAndPartnermonateSettings;

export const hasMutterschutzSettings = (
  settings: CreateElternteileSettings,
): settings is CreateWithMutterschutzSettings => {
  return "mutterschutz" in settings;
};

const hasPartnerMonateSettings = (
  settings: CreateElternteileSettings,
): settings is CreateWithPartnermonateSettings => {
  return "partnerMonate" in settings;
};

const hasGeburtstagSettings = (
  settings: CreateElternteileSettings,
): settings is CreateWithFruehchenSettings => {
  return "geburtstag" in settings;
};

export const getGeburtstagSettings = (
  settings: CreateElternteileSettings | undefined,
) =>
  settings && hasGeburtstagSettings(settings) ? settings.geburtstag : undefined;

export const getPartnerMonateSettings = (
  settings: CreateElternteileSettings | undefined,
) =>
  settings && hasPartnerMonateSettings(settings)
    ? settings.partnerMonate
    : false;
