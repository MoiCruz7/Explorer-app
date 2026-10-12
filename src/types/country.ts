export interface CountryCodes {
  alpha_3: string;
}

export interface CountryNames {
  common: string;
  official: string;
}

export interface CountryFlag {
  url_svg?: string | null;
  url_png?: string | null;
  description?: string | null;
}

export interface CountryCapital {
  name: string;
}

export interface CountryLanguage {
  name?: string | null;
  native_name?: string | null;
}

export interface CountryCurrency {
  name?: string | null;
  code?: string | null;
  symbol?: string | null;
}

export interface Country {
  codes: CountryCodes;
  names: CountryNames;
  flag: CountryFlag;
  region?: string | null;
  population?: number | null;
  capitals?: CountryCapital[] | null;
  languages?: CountryLanguage[] | null;
  currencies?: CountryCurrency[] | null;
}