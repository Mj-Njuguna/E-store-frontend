import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading states
 * Displays a pulsing placeholder while content is loading
 */
const Skeleton = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-neutral-200", className)}
      {...props}
    />
  );
};

Skeleton.propTypes = {
  className: PropTypes.string
};

export default Skeleton;
