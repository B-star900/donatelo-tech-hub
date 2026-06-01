import phoneImg from "@/assets/product-phone-1.jpg";
import laptopImg from "@/assets/product-laptop.jpg";
import earbudsImg from "@/assets/product-earbuds.jpg";
import watchImg from "@/assets/product-watch.jpg";
import keyboardImg from "@/assets/product-keyboard.jpg";
import mouseImg from "@/assets/product-mouse.jpg";
import toolsImg from "@/assets/product-tools.jpg";

export type Category = "Celulares" | "Informática" | "Mecánica";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  salePrice?: number;
  shortDesc: string;
  description: string;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  trending?: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    category: "Celulares",
    price: 1899,
    salePrice: 1699,
    shortDesc: "Titanio. A17 Pro. Cámara de 48 MP.",
    description:
      "El iPhone 15 Pro Max combina un diseño en titanio ultraligero con el chip A17 Pro y un sistema de cámara profesional con teleobjetivo 5x. Pantalla Super Retina XDR de 6.7\" con ProMotion.",
    image: phoneImg,
    images: [phoneImg],
    stock: 12,
    rating: 4.9,
    reviews: 248,
    tags: ["nuevo", "premium", "5g"],
    trending: true,
    featured: true,
  },
  {
    id: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Celulares",
    price: 1799,
    salePrice: 1499,
    shortDesc: "Snapdragon 8 Gen 3. S-Pen. 200 MP.",
    description:
      "Galaxy AI integrado, cámara de 200 MP con zoom 100x y pantalla Dynamic AMOLED 2X de 6.8\". Construcción en titanio.",
    image: phoneImg,
    images: [phoneImg],
    stock: 8,
    rating: 4.8,
    reviews: 192,
    tags: ["oferta", "ai", "5g"],
    trending: true,
    featured: true,
  },
  {
    id: "xiaomi-14-pro",
    name: "Xiaomi 14 Pro",
    brand: "Xiaomi",
    category: "Celulares",
    price: 999,
    shortDesc: "Leica. Snapdragon 8 Gen 3.",
    description:
      "Sistema de cámaras Leica Summilux, carga rápida HyperCharge de 120W y pantalla LTPO 2K.",
    image: phoneImg,
    images: [phoneImg],
    stock: 15,
    rating: 4.7,
    reviews: 134,
    tags: ["nuevo"],
    featured: true,
  },
  {
    id: "macbook-pro-14",
    name: 'MacBook Pro 14" M3 Pro',
    brand: "Apple",
    category: "Informática",
    price: 2499,
    salePrice: 2299,
    shortDesc: "M3 Pro. 18 GB RAM. Liquid Retina XDR.",
    description:
      "Rendimiento profesional con el chip M3 Pro, hasta 18 horas de batería y pantalla Liquid Retina XDR de 14\".",
    image: laptopImg,
    images: [laptopImg],
    stock: 6,
    rating: 4.9,
    reviews: 89,
    tags: ["premium", "creadores"],
    trending: true,
    featured: true,
  },
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2 USB-C",
    brand: "Apple",
    category: "Informática",
    price: 299,
    salePrice: 249,
    shortDesc: "Cancelación activa. Audio adaptativo.",
    description:
      "Chip H2, cancelación activa de ruido mejorada, audio espacial personalizado y estuche USB-C con MagSafe.",
    image: earbudsImg,
    images: [earbudsImg],
    stock: 30,
    rating: 4.8,
    reviews: 412,
    tags: ["oferta", "más vendido"],
    trending: true,
  },
  {
    id: "apple-watch-s9",
    name: "Apple Watch Series 9",
    brand: "Apple",
    category: "Informática",
    price: 499,
    shortDesc: "Chip S9. Doble Tap. Always-On.",
    description:
      "El nuevo gesto Doble Tap, pantalla más brillante del mercado y monitoreo avanzado de salud.",
    image: watchImg,
    images: [watchImg],
    stock: 18,
    rating: 4.7,
    reviews: 156,
    tags: ["nuevo"],
  },
  {
    id: "keychron-q1",
    name: "Keychron Q1 Mecánico",
    brand: "Keychron",
    category: "Informática",
    price: 199,
    salePrice: 169,
    shortDesc: "Hot-swap. Aluminio CNC. QMK/VIA.",
    description:
      "Teclado mecánico personalizable con chasis de aluminio mecanizado, switches hot-swap y soporte QMK/VIA.",
    image: keyboardImg,
    images: [keyboardImg],
    stock: 22,
    rating: 4.8,
    reviews: 78,
    tags: ["oferta"],
  },
  {
    id: "logitech-g-pro",
    name: "Logitech G Pro X Superlight",
    brand: "Logitech",
    category: "Informática",
    price: 159,
    shortDesc: "63 g. HERO 25K. Wireless.",
    description:
      "Mouse gaming ultraligero de 63 g con sensor HERO 25K y conexión LIGHTSPEED inalámbrica.",
    image: mouseImg,
    images: [mouseImg],
    stock: 25,
    rating: 4.9,
    reviews: 211,
    tags: ["gaming"],
  },
  {
    id: "kit-dados-pro",
    name: "Kit de Dados Profesional 108 pzs",
    brand: "Stanley",
    category: "Mecánica",
    price: 249,
    salePrice: 199,
    shortDesc: "Cromo vanadio. Trinquete 72T.",
    description:
      "Set completo para mecánica profesional: dados métricos y SAE, trinquete de 72 dientes y estuche de transporte.",
    image: toolsImg,
    images: [toolsImg],
    stock: 14,
    rating: 4.7,
    reviews: 64,
    tags: ["oferta", "profesional"],
  },
];

export const categories: Category[] = ["Celulares", "Informática", "Mecánica"];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
