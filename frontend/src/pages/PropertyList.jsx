import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../redux/propertySlice';
import PropertyCard from '../components/PropertyCard';
import ContactModal from '../components/ContactModal';
import '../styles/PropertyList.css';

const ITEMS_PER_PAGE = 9;

function PropertyList() {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector(
    (state) => state.properties
  );

  // Filter and pagination states
  const [selectedType, setSelectedType] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Contact modal states
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // Dynamically extract unique property types
  const propertyTypes = useMemo(() => {
    const types = properties
      .map((p) => p.property_type)
      .filter((type) => Boolean(type));
    return Array.from(new Set(types)).sort();
  }, [properties]);

  // Dynamically extract unique developers
  const developers = useMemo(() => {
    const devs = properties
      .map((p) => p.developer)
      .filter((dev) => Boolean(dev));
    return Array.from(new Set(devs)).sort();
  }, [properties]);

  // Compute filtered properties on frontend
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesType = selectedType
        ? property.property_type === selectedType
        : true;
      const matchesDeveloper = selectedDeveloper
        ? property.developer === selectedDeveloper
        : true;
      return matchesType && matchesDeveloper;
    });
  }, [properties, selectedType, selectedDeveloper]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = useMemo(() => {
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, startIndex]);

  // Handle filter changes (resets to page 1)
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  const handleDeveloperChange = (e) => {
    setSelectedDeveloper(e.target.value);
    setCurrentPage(1);
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setSelectedType('');
    setSelectedDeveloper('');
    setCurrentPage(1);
  };

  // Page change handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Contact modal handlers
  const handleOpenContact = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseContact = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="container py-4">
      {/* Header / Hero Section */}
      <section className="hero-section text-center text-md-start">
        <h1 className="hero-title">Discover the Best Properties</h1>
        <p className="hero-subtitle">
          Explore luxury villas, modern apartments, and premium real estate
          listings tailored to your lifestyle.
        </p>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="status-container">
          <div
            className="spinner-border text-primary loading-spinner"
            role="status"
          >
            <span className="visually-hidden">Loading properties...</span>
          </div>
          <p className="mt-3 text-muted">Loading properties...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger my-4 text-center" role="alert">
          <h5 className="alert-heading mb-2">Unable to Load Properties</h5>
          <p className="mb-2">{error}</p>
          <p className="small text-muted mb-3">
            Please make sure the backend server is running at <code>http://localhost:5000</code>.
          </p>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => dispatch(fetchProperties())}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Filter Section (visible when properties are loaded) */}
      {!loading && !error && properties.length > 0 && (
        <section className="filter-card mb-4 p-3 p-md-4">
          <div className="row g-3 align-items-end">
            {/* Property Type Filter */}
            <div className="col-12 col-md-5 col-lg-4">
              <label htmlFor="propertyTypeFilter" className="form-label">
                Property Type
              </label>
              <select
                id="propertyTypeFilter"
                className="form-select"
                value={selectedType}
                onChange={handleTypeChange}
              >
                <option value="">All Property Types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Developer Filter */}
            <div className="col-12 col-md-5 col-lg-4">
              <label htmlFor="developerFilter" className="form-label">
                Developer
              </label>
              <select
                id="developerFilter"
                className="form-select"
                value={selectedDeveloper}
                onChange={handleDeveloperChange}
              >
                <option value="">All Developers</option>
                {developers.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset All Filters Button */}
            <div className="col-12 col-md-2 col-lg-4 d-flex justify-content-md-start">
              <button
                type="button"
                className="btn btn-outline-secondary btn-reset-filters w-100"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State (if no properties overall or none match filters) */}
      {!loading && !error && filteredProperties.length === 0 && (
        <div className="status-container">
          <p className="lead text-muted">No properties found.</p>
        </div>
      )}

      {/* 3-Column Responsive Grid on Desktop (Paginated properties) */}
      {!loading && !error && paginatedProperties.length > 0 && (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {paginatedProperties.map((property) => (
              <PropertyCard
                key={property.id || property._id}
                property={property}
                onContact={handleOpenContact}
              />
            ))}
          </div>

          {/* Pagination Controls (only shown when totalPages > 1) */}
          {totalPages > 1 && (
            <nav
              className="pagination-section"
              aria-label="Properties pagination"
            >
              <ul className="pagination justify-content-center flex-wrap">
                {/* Previous Button */}
                <li
                  className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`page-item ${
                        currentPage === pageNumber ? 'active' : ''
                      }`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => handlePageChange(pageNumber)}
                        aria-current={
                          currentPage === pageNumber ? 'page' : undefined
                        }
                      >
                        {pageNumber}
                      </button>
                    </li>
                  )
                )}

                {/* Next Button */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? 'disabled' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseContact}
        property={selectedProperty}
      />
    </div>
  );
}

export default PropertyList;
