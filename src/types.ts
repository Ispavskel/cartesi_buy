export interface Payload {
  action: string;
  [key: string]: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: "customer" | "vendor";
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
}
