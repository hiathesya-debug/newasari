export type Category = "Freshest Series" | "Premium Series" | "Custom Order";

export const CATEGORIES: Category[] = [
  "Freshest Series",
  "Premium Series",
];

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  inStock: boolean;
  description: string;
  status: "Active" | "Draft";
  image?: string;
}

// Mock data for demonstration
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Organic Vegetables",
    category: "Freshest Series",
    price: 45000,
    stock: 100,
    inStock: true,
    description: "Fresh and organic vegetables sourced locally",
    status: "Active",
  },
  {
    id: "2",
    name: "Premium Fruit Selection",
    category: "Premium Series",
    price: 85000,
    stock: 50,
    inStock: true,
    description: "Premium quality fruits from selected farms",
    status: "Active",
  },
  {
    id: "3",
    name: "Seasonal Specialty Items",
    category: "Freshest Series",
    price: 65000,
    stock: 0,
    inStock: false,
    description: "Specialty items available during seasons",
    status: "Draft",
  },
];
