import React from 'react';
import ClubRiskDisplay from './ClubRiskDisplay';

function Card({ heading, paragraph, imageUrl }) {
  return (
    <div className="Card bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {imageUrl && <img src={imageUrl} alt={heading} className="Card-image mb-4 rounded" />}
      <h2 className="Card-heading text-2xl font-bold mb-2">{heading}</h2>
      <p className="Card-paragraph mb-4">{paragraph}</p>
      <div className="w-full flex justify-center">
        <ClubRiskDisplay />
      </div>
    </div>
  );
}

export default Card;