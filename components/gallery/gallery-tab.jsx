import NextImage from "next/image";
import { Tab } from "@headlessui/react";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";
import { ImagePropType } from "@/types";

/**
 * Gallery tab component for product images
 */
const GalleryTab = ({
  image
}) => {
  return ( 
    <Tab
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white"
    >
      {({ selected }) => (
        <div>
          <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
            <NextImage 
              fill 
              src={image.url} 
              alt="" 
              className="object-cover object-center" 
            />
          </span>
          <span
            className={cn(
              'absolute inset-0 rounded-md ring-2 ring-offset-2',
              selected ? 'ring-black' : 'ring-transparent',
            )}
          />
        </div>
      )}
    </Tab>
  );
}

GalleryTab.propTypes = {
  image: ImagePropType.isRequired
};
 
export default GalleryTab;
