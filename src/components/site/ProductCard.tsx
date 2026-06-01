import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const onSale = product.salePrice && product.salePrice < product.price;
  const discount = onSale
    ? Math.round((1 - (product.salePrice as number) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
    >
      <Link
        to="/producto/$id"
        params={{ id: product.id }}
        className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-elegant"
      >
        <div className="relative aspect-square overflow-hidden bg-surface">
          {onSale && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-foreground">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Agotado
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
            <span>{product.brand}</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-brand text-brand" /> {product.rating}
            </span>
          </div>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug">
            {product.name}
          </h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            {onSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
