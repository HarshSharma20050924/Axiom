export interface Product {
  id: string;
  name: string;
  designer: string;
  year: string;
  price: number;
  description: string;
  image: string;
  details: string[];
  provenance: {
    origin: string;
    materials: string[];
    carbonFootprint: string;
    artisan: string;
  };
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  products: Product[];
}

export interface ArticleBlock {
  type: 'paragraph' | 'header' | 'image' | 'quote' | 'product';
  content: string;
  productId?: string;
  alt?: string;
}

export interface Article {
  id: string;
  issueNumber: string;
  title: string;
  subtitle: string;
  date: string;
  coverImage: string;
  blocks: ArticleBlock[];
}

export enum ViewState {
  COLLECTION = 'COLLECTION',
  PRODUCT = 'PRODUCT',
  CART = 'CART',
  ATELIER = 'ATELIER',
  JOURNAL = 'JOURNAL'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}