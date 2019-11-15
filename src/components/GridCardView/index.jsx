import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import logo from '../App/logo.svg';

const GridCardView = (props) => {
  const { item: { title, details } } = props;
  return (
    <div className="card">
      <div className="container">
        <img src={logo} alt="Movie" />
        {title}
        <p>{details}</p>
      </div>
    </div>
  );
};

GridCardView.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    details: PropTypes.string,
  }),
};

GridCardView.defaultProps = {
  item: {
    title: 'Default Title',
    details: 'Default Details',
  },
};

export default GridCardView;
