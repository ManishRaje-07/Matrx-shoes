import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import styles from './Contact.module.css';

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const { addToast } = useShop();
  const [fields, setFields] = useState<FormFields>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!fields.name.trim()) {
      tempErrors.name = 'Full Name is required';
      isValid = false;
    }

    if (!fields.email.trim()) {
      tempErrors.email = 'Email Address is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fields.email)) {
        tempErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    if (!fields.subject.trim()) {
      tempErrors.subject = 'Subject is required';
      isValid = false;
    }

    if (!fields.message.trim()) {
      tempErrors.message = 'Message content is required';
      isValid = false;
    } else if (fields.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear error dynamically as the user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please correct the validation errors in the form.', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (response.ok) {
        addToast('Message sent! Our support team will respond within 24 hours.', 'success');
        setFields({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setErrors({});
      } else {
        addToast('Failed to send message. Please try again later.', 'error');
      }
    } catch {
      addToast('Failed to connect to contact server.', 'error');
    }
  };

  return (
    <div className={styles.contactPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <span className={styles.subtitle}>GET IN TOUCH</span>
          <h1 className={styles.title}>Contact Us</h1>
        </div>
      </div>

      <div className={styles.container}>
        {/* Left Side: Contact Information Cards */}
        <div className={styles.infoCol}>
          <h2>Speak to Our Team</h2>
          <p className={styles.lead}>
            Have questions about sizing, orders, or custom models? Reach out directly. Our support staff is online to assist.
          </p>

          <div className={styles.infoCardsGrid}>
            <div className={styles.infoCard}>
              <FiPhone className={styles.infoIcon} />
              <div>
                <h3>Phone Hotline</h3>
                <p>+1 (800) 555-SHOE</p>
                <span className={styles.mutedText}>Mon-Fri: 9 AM - 6 PM EST</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FiMail className={styles.infoIcon} />
              <div>
                <h3>Support Email</h3>
                <p>support@martxshoes.com</p>
                <span className={styles.mutedText}>Replies within 24 hours</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FiMapPin className={styles.infoIcon} />
              <div>
                <h3>Headquarters</h3>
                <p>120 Sneaker Blvd, Suite 400</p>
                <span className={styles.mutedText}>New York, NY 10001</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FiClock className={styles.infoIcon} />
              <div>
                <h3>Retail Showroom Hours</h3>
                <p>Mon-Sat: 10 AM - 8 PM</p>
                <span className={styles.mutedText}>Sunday: 11 AM - 6 PM EST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Validated Contact Form */}
        <div className={styles.formCol}>
          <div className={styles.formCard}>
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formField}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={fields.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className={errors.name ? styles.inputError : ''}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.formField}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={fields.email}
                  onChange={handleInputChange}
                  placeholder="yourname@example.com"
                  className={errors.email ? styles.inputError : ''}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formField}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={fields.subject}
                  onChange={handleInputChange}
                  placeholder="Order query, size questions..."
                  className={errors.subject ? styles.inputError : ''}
                />
                {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
              </div>

              <div className={styles.formField}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={fields.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here..."
                  className={errors.message ? styles.inputError : ''}
                />
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Send Message</span>
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Styled Interactive Location Map Frame */}
      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <div className={styles.mapOverlay}>
            <div className={styles.mapLabel}>
              <FiMapPin className={styles.mapPinIcon} />
              <div>
                <strong>MartX Flagship Store</strong>
                <p>120 Sneaker Blvd, NYC</p>
              </div>
            </div>
          </div>
          {/* Mocked Premium Vector Map Visual */}
          <div className={styles.mockMap}>
            <div className={styles.gridLine} style={{ top: '25%' }} />
            <div className={styles.gridLine} style={{ top: '50%' }} />
            <div className={styles.gridLine} style={{ top: '75%' }} />
            <div className={styles.gridLineVertical} style={{ left: '33%' }} />
            <div className={styles.gridLineVertical} style={{ left: '66%' }} />
            <div className={styles.mapMarker} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
