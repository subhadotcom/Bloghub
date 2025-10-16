// Newsletter Configuration for GitHub Pages
// Update these values with your actual service credentials

const NEWSLETTER_CONFIG = {
  // Formspree Configuration (Option 1 - Recommended)
  FORMPREE: {
    FORM_ID: 'YOUR_FORM_ID', // Replace with your Formspree form ID
    ENABLED: true // Set to false if not using Formspree
  },

  // EmailJS Configuration (Option 2)
  EMAILJS: {
    SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
    ENABLED: false // Set to true if using EmailJS
  },

  // Airtable Configuration (Option 3 - Database)
  AIRTABLE: {
    API_KEY: 'YOUR_API_KEY', // Replace with your Airtable API key
    BASE_ID: 'YOUR_BASE_ID', // Replace with your Airtable base ID
    TABLE_NAME: 'Subscribers', // Table name in Airtable
    ENABLED: false // Set to true if using Airtable
  },

  // Google Forms Configuration (Option 4)
  GOOGLE_FORMS: {
    FORM_URL: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse',
    ENABLED: false // Set to true if using Google Forms
  },

  // General Settings
  SETTINGS: {
    SITE_URL: 'https://yourusername.github.io/Bloghub', // Replace with your GitHub Pages URL
    ADMIN_PASSWORD: 'admin123', // Password for admin access (change this!)
    ENABLE_ANALYTICS: true, // Enable Google Analytics tracking
    MAX_SUBSCRIBERS: 1000, // Maximum number of subscribers to store locally
    AUTO_CLEANUP_DAYS: 365 // Auto-cleanup subscribers older than this many days
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NEWSLETTER_CONFIG;
}
