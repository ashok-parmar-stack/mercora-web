export interface CountryStatus {
  id: string;
  type: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Country {
  id: string;
  name: string;
  officialName?: string | null;
  iso2Code: string;
  iso3Code: string;
  numericCode?: string | null;
  phoneCode?: string | null;
  currencyCode?: string | null;
  statusId?: string | null;
  status?: CountryStatus | null;
  source: string;
  sourceCode?: string | null;
  sourceRecordId?: string | null;
  sourceUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CountryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC' | 'asc' | 'desc';
}

export interface CreateCountryInput {
  name: string;
  officialName?: string;
  iso2Code: string;
  iso3Code: string;
  numericCode?: string;
  phoneCode?: string;
  currencyCode?: string;
  status?: string;
  statusId?: string;
  source?: string;
  sourceCode?: string;
}

export interface UpdateCountryInput extends Partial<CreateCountryInput> {}

export interface GeographicPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedCountriesResponse {
  items: Country[];
  pagination: GeographicPagination;
}

export interface GeographicApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface GeographicDashboardMetrics {
  countriesCount: number;
  statesCount: number;
  districtsCount: number;
  subDistrictsCount: number;
  citiesCount?: number;
  localitiesCount?: number;
  postalCodesCount?: number;
  postOfficesCount?: number;
  recentImports: Array<{
    id: string;
    source: string;
    dataset: string;
    version: string;
    recordsCount: number;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FAILED';
    lastSync: string;
  }>;
}

export interface State {
  id: string;
  name: string;
  localName?: string | null;
  code: string;
  countryId: string;
  country?: Country | null;
  type?: string | null; // e.g. 'STATE', 'UNION_TERRITORY', 'PROVINCE'
  censusCode?: string | null;
  statusId?: string | null;
  status?: CountryStatus | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface StateQueryParams extends CountryQueryParams {
  countryId?: string;
  type?: string;
}

export interface CreateStateInput {
  name: string;
  localName?: string;
  code: string;
  countryId: string;
  type?: string;
  censusCode?: string;
  statusId?: string;
  status?: string;
  source?: string;
}

export interface UpdateStateInput extends Partial<CreateStateInput> {}

export interface PaginatedStatesResponse {
  items: State[];
  pagination: GeographicPagination;
}

export interface District {
  id: string;
  name: string;
  localName?: string | null;
  code: string;
  stateId: string;
  state?: State | null;
  type?: string | null;
  censusCode?: string | null;
  statusId?: string | null;
  status?: CountryStatus | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface DistrictQueryParams extends CountryQueryParams {
  stateId?: string;
  type?: string;
}

export interface CreateDistrictInput {
  name: string;
  localName?: string;
  code: string;
  stateId: string;
  type?: string;
  censusCode?: string;
  statusId?: string;
  status?: string;
  source?: string;
}

export interface UpdateDistrictInput extends Partial<CreateDistrictInput> {}

export interface PaginatedDistrictsResponse {
  items: District[];
  pagination: GeographicPagination;
}


export interface SubDistrict {
  id: string;
  name: string;
  localName?: string | null;
  code: string;
  districtId: string;
  district?: District | null;
  type?: string | null;
  censusCode?: string | null;
  statusId?: string | null;
  status?: CountryStatus | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface SubDistrictQueryParams extends CountryQueryParams {
  districtId?: string;
  type?: string;
}

export interface CreateSubDistrictInput {
  name: string;
  localName?: string;
  code: string;
  districtId: string;
  type?: string;
  censusCode?: string;
  statusId?: string;
  status?: string;
  source?: string;
}

export interface UpdateSubDistrictInput extends Partial<CreateSubDistrictInput> {}

export interface PaginatedSubDistrictsResponse {
  items: SubDistrict[];
  pagination: GeographicPagination;
}


export interface City {
  id: string;
  name: string;
  localName?: string | null;
  code: string;
  subDistrictId: string;
  subDistrict?: SubDistrict | null;
  type?: string | null;
  censusCode?: string | null;
  statusId?: string | null;
  status?: CountryStatus | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CityQueryParams extends CountryQueryParams {
  subDistrictId?: string;
  type?: string;
}

export interface CreateCityInput {
  name: string;
  localName?: string;
  code: string;
  subDistrictId: string;
  type?: string;
  censusCode?: string;
  statusId?: string;
  status?: string;
  source?: string;
}

export interface UpdateCityInput extends Partial<CreateCityInput> {}

export interface PaginatedCitysResponse {
  items: City[];
  pagination: GeographicPagination;
}
export type PaginatedCitiesResponse = PaginatedCitysResponse;


export interface Locality {
  id: string;
  name: string;
  localName?: string | null;
  code: string;
  cityId: string;
  city?: City | null;
  type?: string | null;
  censusCode?: string | null;
  statusId?: string | null;
  status?: CountryStatus | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface LocalityQueryParams extends CountryQueryParams {
  cityId?: string;
  type?: string;
}

export interface CreateLocalityInput {
  name: string;
  localName?: string;
  code: string;
  cityId: string;
  type?: string;
  censusCode?: string;
  statusId?: string;
  status?: string;
  source?: string;
}

export interface UpdateLocalityInput extends Partial<CreateLocalityInput> {}

export interface PaginatedLocalitysResponse {
  items: Locality[];
  pagination: GeographicPagination;
}
export type PaginatedLocalitiesResponse = PaginatedLocalitysResponse;


export interface PostalCode {
  id: string;
  name: string;
  localName?: string | null;
  code: string;
  countryId: string;
  country?: Country | null;
  type?: string | null;
  censusCode?: string | null;
  statusId?: string | null;
  status?: CountryStatus | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PostalCodeQueryParams extends CountryQueryParams {
  countryId?: string;
  type?: string;
}

export interface CreatePostalCodeInput {
  name: string;
  localName?: string;
  code: string;
  countryId: string;
  type?: string;
  censusCode?: string;
  statusId?: string;
  status?: string;
  source?: string;
}

export interface UpdatePostalCodeInput extends Partial<CreatePostalCodeInput> {}

export interface PaginatedPostalCodesResponse {
  items: PostalCode[];
  pagination: GeographicPagination;
}


export interface PostOffice {
  id: string;
  name: string;
  localName?: string | null;
  code: string;
  postalCodeId: string;
  postalCode?: PostalCode | null;
  type?: string | null;
  censusCode?: string | null;
  statusId?: string | null;
  status?: CountryStatus | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PostOfficeQueryParams extends CountryQueryParams {
  postalCodeId?: string;
  type?: string;
}

export interface CreatePostOfficeInput {
  name: string;
  localName?: string;
  code: string;
  postalCodeId: string;
  type?: string;
  censusCode?: string;
  statusId?: string;
  status?: string;
  source?: string;
}

export interface UpdatePostOfficeInput extends Partial<CreatePostOfficeInput> {}

export interface PaginatedPostOfficesResponse {
  items: PostOffice[];
  pagination: GeographicPagination;
}
