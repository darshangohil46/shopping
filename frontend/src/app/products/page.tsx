import { Metadata } from 'next';
import { ProductList } from '../../components/products/ProductList';

export const metadata: Metadata = {
  title: 'Products - Online Shopping Cart',
  description: 'Explore all available shopping products and add items to your cart.',
};

export default function ProductsPage() {
  return (
    <div className="flex-1 flex flex-col bg-white text-black">
      <ProductList />
    </div>
  );
}
