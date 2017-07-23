/* eslint react/prop-types: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router/Route';
import Link from 'react-router-dom/Link';

const NavLink = ({
  to,
  exact,
  strict,
  location,
  activeClassName,
  className,
  activeStyle,
  style,
  getIsActive,
  ...rest
}) => React.createElement(Route, {
  path: typeof to === 'object' ? to.pathname : to,
  exact,
  strict,
  location
}, (props) => {
  const isActive = Boolean(getIsActive ? getIsActive(props.match, props.location) : props.match);

  return React.createElement(Link, Object.assign({
    to,
    className: isActive ? [activeClassName, className].filter(Boolean).join(' ') : className,
    style: isActive ? Object.assign({}, style, activeStyle) : style
  }, rest));
});

NavLink.propTypes = {
  to: Link.propTypes.to,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  location: PropTypes.object,
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  activeStyle: PropTypes.object,
  style: PropTypes.object,
  getIsActive: PropTypes.func,
  isActive: PropTypes.func
};

NavLink.defaultProps = {
  activeClassName: 'active'
};

export default NavLink;
