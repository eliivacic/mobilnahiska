export type HouseType = "mobilna" | "modularna";

export type Condition = "nova" | "rabljena";

export type Country = "Slovenija" | "Hrvaška" | "Italija" | "Avstrija" | "ostalo";

export type SellerType = "Profesionalni prodajalec" | "Zasebnik";

export interface Seller {
  name: string;
  type: SellerType;
  location: string;
  country: Country;
  phone: string;
  memberSince: number;
  activeListings?: number;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  manufacturer: string;
  price: number;
  year: number;
  condition: Condition;
  type: HouseType;
  area: number;
  width: number;
  length: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  location: string;
  country: Country;
  deliveryAvailable: boolean;
  featured?: boolean;
  description: string;
  features: string[];
  images: string[];
  seller: Seller;
}
