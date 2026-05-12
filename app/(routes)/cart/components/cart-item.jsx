import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import PropTypes from "prop-types";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { ProductPropType } from "@/types";

const CartItem = ({ data }) => {
  const { removeItem, incrementItem, decrementItem } = useCart();
  const quantity = data.quantity || 1;

  return (
    <li className="flex py-6 border-b">
<div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
         <Image
           fill
           src={data.images?.[0]?.url || '/image.png'}
           alt={data.name || ''}
           className="object-cover object-center"
         />
       </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={() => removeItem(data.id)} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">{data.name}</p>
          </div>
          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.color.name}</p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{data.size.name}</p>
          </div>
          <Currency value={Number(data.price) * quantity} />
          <div className="mt-3 flex items-center gap-x-3">
            <IconButton onClick={() => decrementItem(data.id)} icon={<Minus size={13} />} />
            <span className="text-sm font-medium w-4 text-center">{quantity}</span>
            <IconButton onClick={() => incrementItem(data.id)} icon={<Plus size={13} />} />
          </div>
        </div>
      </div>
    </li>
  );
};

CartItem.propTypes = {
  data: ProductPropType.isRequired,
};

export default CartItem;
