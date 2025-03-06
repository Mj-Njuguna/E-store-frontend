// This file contains constants and PropTypes definitions for type checking
// in the JavaScript version of the application
import PropTypes from 'prop-types';

// PropTypes definitions for runtime type checking
export const ImagePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
});

export const BillboardPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
});

export const CategoryPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  billboard: BillboardPropType.isRequired
});

export const SizePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
});

export const ColorPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
});

export const ProductPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  category: CategoryPropType.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  isFeatured: PropTypes.bool.isRequired,
  size: SizePropType.isRequired,
  color: ColorPropType.isRequired,
  images: PropTypes.arrayOf(ImagePropType).isRequired
});
