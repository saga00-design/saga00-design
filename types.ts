export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
}

export interface ThemeConfig {
  columnCount: number;
  gap: number;
  primaryColor: string;
  titleFont: 'sans' | 'serif';
}

export interface AIState {
  isGenerating: boolean;
  error: string | null;
}
