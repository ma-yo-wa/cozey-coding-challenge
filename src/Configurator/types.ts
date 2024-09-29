export interface ConfigSelectionData {
  color?: string;
  seating?: string;
}

export interface handleconfig {
  color?: string;
  seating?: string;
}

export interface FetchDataResponse {
  seatingOptions: { value: string; title: string }[];
}

export interface CartItem {
  quantity: number;
  variantId: string;
  options: {
    color: string | undefined;
    seating: string | undefined;
  };
}
