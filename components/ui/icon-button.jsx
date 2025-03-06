import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/**
 * Button component that displays an icon
 */
const IconButton = ({
  onClick,
  icon,
  className
}) => {
  return ( 
    <button 
      onClick={onClick} 
      className={cn(
        'rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition',
        className
      )}
    >
      {icon}
    </button>
   );
}

IconButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.element.isRequired,
  className: PropTypes.string
};

export default IconButton;
