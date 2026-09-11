import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../styles/ContactModal.css';

function ContactModal({ isOpen, onClose, property }) {
  const [step, setStep] = useState(1);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Touched states for validation display
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Reset form when modal opens/closes or property changes
  const resetForm = () => {
    setStep(1);
    setName('');
    setEmail('');
    setPhone('');
    setNameTouched(false);
    setEmailTouched(false);
    setPhoneTouched(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen || !property) return null;

  // Validation logic
  const trimmedName = name.trim();
  const isNameValid = trimmedName.length >= 4;
  const showNameError = nameTouched && trimmedName.length > 0 && !isNameValid;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email.trim());
  const showEmailError = emailTouched && (!email.trim() || !isEmailValid);

  const digitsOnly = (phone || '').replace(/\D/g, '');
  const isPhoneValid = digitsOnly.length >= 10 && digitsOnly.length <= 12;
  const showPhoneError = phoneTouched && (!phone || !isPhoneValid);

  // Handlers
  const handleNextStep1 = (e) => {
    e.preventDefault();
    setNameTouched(true);
    if (isNameValid) {
      setStep(2);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  const handleSubmitStep2 = (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPhoneTouched(true);

    if (isEmailValid && isPhoneValid) {
      // Step 3: Success state
      setStep(3);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={handleClose}>
      <div
        className="contact-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contactModalTitle"
      >
        {/* Modal Header */}
        <div className="contact-modal-header">
          <div>
            <h4 id="contactModalTitle" className="modal-title-custom">
              Contact Property Agent
            </h4>
            <span className="modal-property-subtitle" title={property.title}>
              Enquiry for: <strong>{property.title}</strong>
            </span>
          </div>
          <button
            type="button"
            className="btn-close-custom"
            onClick={handleClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="contact-modal-body">
          {/* Step Progress Indicator (for Step 1 & 2) */}
          {step < 3 && (
            <div className="step-indicator">
              <span className={`step-badge ${step === 1 ? 'active' : ''}`}>
                Step 1: Name
              </span>
              <span>&rarr;</span>
              <span className={`step-badge ${step === 2 ? 'active' : ''}`}>
                Step 2: Contact Info
              </span>
            </div>
          )}

          {/* STEP 1: Name Input */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} noValidate>
              <div className="form-group-custom">
                <label htmlFor="contactName">Your Full Name</label>
                <input
                  type="text"
                  id="contactName"
                  className={`form-control-dark ${
                    showNameError ? 'is-invalid' : ''
                  }`}
                  placeholder="Enter at least 4 characters"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setNameTouched(true)}
                  autoFocus
                />
                {showNameError && (
                  <span className="validation-error-text">
                    Name must be at least 4 characters.
                  </span>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-modal-primary"
                  disabled={!name.trim() || !isNameValid}
                >
                  Next &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Email & Phone Inputs */}
          {step === 2 && (
            <form onSubmit={handleSubmitStep2} noValidate>
              <div className="form-group-custom">
                <label htmlFor="contactEmail">Email Address</label>
                <input
                  type="email"
                  id="contactEmail"
                  className={`form-control-dark ${
                    showEmailError ? 'is-invalid' : ''
                  }`}
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  autoFocus
                />
                {showEmailError && (
                  <span className="validation-error-text">
                    Please enter a valid email address.
                  </span>
                )}
              </div>

              <div className="form-group-custom">
                <label htmlFor="contactPhone">Phone Number</label>
                <div className="phone-input-container-dark">
                  <PhoneInput
                    country={'ae'}
                    value={phone}
                    onChange={(val) => setPhone(val)}
                    onBlur={() => setPhoneTouched(true)}
                    inputProps={{
                      id: 'contactPhone',
                      name: 'phone',
                      required: true,
                      className: `form-control ${
                        showPhoneError ? 'is-invalid' : ''
                      }`,
                    }}
                  />
                </div>
                {showPhoneError && (
                  <span className="validation-error-text">
                    Phone number must contain 10 to 12 digits.
                  </span>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-secondary"
                  onClick={handleBackToStep1}
                >
                  &larr; Back
                </button>
                <button
                  type="submit"
                  className="btn-modal-primary"
                  disabled={!isEmailValid || !isPhoneValid}
                >
                  Submit Enquiry
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Thank You Confirmation */}
          {step === 3 && (
            <div className="success-container">
              <div className="success-icon">&#10003;</div>
              <h3 className="success-title">Thank you for contacting us!</h3>
              <p className="success-message">
                Your enquiry for <strong>{property.title}</strong> has been
                received successfully. Our agent will reach out to you shortly.
              </p>
              <button
                type="button"
                className="btn-modal-primary w-100"
                onClick={handleClose}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactModal;

