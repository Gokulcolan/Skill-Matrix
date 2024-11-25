
import React from 'react';
import './Loader.css';  // Import the CSS file for the spinner

const Loader = () => {
    return (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    );
};

export default Loader;