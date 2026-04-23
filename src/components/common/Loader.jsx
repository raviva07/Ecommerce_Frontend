import React from "react";
import PropTypes from "prop-types";

const Loader = ({ fullScreen = false, text = "" }) => {
  const spinner = (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className="spinner-border text-primary mb-2" role="status"></div>
      {text && <p className="text-muted">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75">
        {spinner}
      </div>
    );
  }

  return spinner;
};

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
};

export default Loader;
