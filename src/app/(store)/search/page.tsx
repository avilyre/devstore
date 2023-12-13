import Link from "next/link";
import Image from "next/image";
import { SearchProps } from "./interface";
import { redirect } from "next/navigation";
import { Product } from "@/data/types/product";
import { api } from "@/data/api";

async function searchProducts(query: string): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const response = await api(`/products/search?q=${query}`, {
    next: {
      revalidate: 60 * 60, // 1hour
    },
  });

  const products = await response.json();

  return products;
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams;

  if (!query) {
    redirect("/");
  }

  const products = await searchProducts(query);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {products.map(product => (
          <Link
            key={product.id}
            href="/products/moletom-never-stop-learning"
            className="product-item group relative rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-center"
          >
            <Image
              className="group-hover:scale-105 transition-transform duration-500"
              src={product.image}
              height={480}
              width={480}
              quality={100}
              alt=""
            />

            <div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
              <span className="text-sm truncate">{product.title}</span>
              <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
                {product.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
