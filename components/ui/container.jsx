import PropTypes from "prop-types";

/**
 * Container component for consistent page width
 */
const Container = ({ children }) => {
  return ( 
    <div className="mx-auto max-w-7xl">
      {children}
    </div>
   );
};

Container.propTypes = {
  children: PropTypes.node.isRequired
};

export default Container;
