import PropTypes from 'prop-types';
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import { ProductPropType } from "@/types";

/**
 * Displays a grid of product cards with a title
 */
const ProductList = ({ title, items }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title}</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
   );
}

ProductList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(ProductPropType).isRequired
};
 
export default ProductList;
