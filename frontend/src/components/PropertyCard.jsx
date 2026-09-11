import React from 'react';

function PropertyCard({ property, onContact }) {
  if (!property) return null;

  const {
    property_image,
    title,
    property_price,
    currency,
    area,
    developer,
    property_type,
    small_description,
  } = property;

  // Format price nicely: e.g. "AED 3,200,000"
  const formattedPrice =
    typeof property_price === 'number'
      ? `${currency || 'AED'} ${property_price.toLocaleString()}`
      : `${currency || 'AED'} ${property_price}`;

  // Fallback image in case network or URL fails
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/400x300?text=Property+Image';
  };

  return (
    <div className="col">
      <div className="property-card">
        <div className="property-image-wrapper">
          <img
            src={property_image}
            alt={title}
            className="property-image"
            onError={handleImageError}
            loading="lazy"
          />
          {property_type && (
            <span className="property-type-badge">{property_type}</span>
          )}
        </div>

        <div className="property-card-body">
          <div className="property-price">{formattedPrice}</div>
          <h5 className="property-title">{title}</h5>

          <div className="property-meta">
            <div className="property-area">
              <span>📍 {area}</span>
            </div>
            <div className="property-developer">
              <span>🏢 By {developer}</span>
            </div>
          </div>

          <p className="property-description">{small_description}</p>

          <div className="property-card-footer">
            <button
              type="button"
              className="btn btn-contact"
              onClick={() => onContact && onContact(property)}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
