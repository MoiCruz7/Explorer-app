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

export interface Country {
  codes: CountryCodes;
  names: CountryNames;
  flag: CountryFlag;
  region?: string | null;
  population?: number | null;
  capitals?: CountryCapital[] | null;
}