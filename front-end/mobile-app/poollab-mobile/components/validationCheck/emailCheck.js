// utils/emailValidator.js

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateEmail = (email) => {
  // Initialize result object
  const result = {
    isValid: false,
    error: null,
    details: {}
  };

  try {
    // Trim the email
    email = email.trim();

    // Check if email is empty
    if (!email) {
      return {
        isValid: false,
        error: 'Email cannot be empty',
        details: { type: 'empty' }
      };
    }

    // Check minimum length (a@b.c = 5 chars minimum)
    if (email.length < 5) {
      return {
        isValid: false,
        error: 'Email is too short',
        details: { 
          type: 'length',
          current: email.length,
          minimum: 5
        }
      };
    }

    // Check maximum length (RFC 5321)
    if (email.length > 254) {
      return {
        isValid: false,
        error: 'Email is too long',
        details: {
          type: 'length',
          current: email.length,
          maximum: 254
        }
      };
    }

    // Check for @ symbol
    if (!email.includes('@')) {
      return {
        isValid: false,
        error: 'Email must contain @',
        details: { type: 'missing_symbol' }
      };
    }

    // Check for multiple @ symbols
    if ((email.match(/@/g) || []).length > 1) {
      return {
        isValid: false,
        error: 'Email must contain exactly one @ symbol',
        details: { type: 'multiple_symbols' }
      };
    }

    // Split email into local part and domain
    const [localPart, domain] = email.split('@');

    // Check local part length
    if (localPart.length > 64) {
      return {
        isValid: false,
        error: 'Local part of email is too long',
        details: {
          type: 'local_part_length',
          current: localPart.length,
          maximum: 64
        }
      };
    }

    // Check domain length
    if (domain.length > 255) {
      return {
        isValid: false,
        error: 'Domain part of email is too long',
        details: {
          type: 'domain_length',
          current: domain.length,
          maximum: 255
        }
      };
    }

    // Check if domain has at least one dot
    if (!domain.includes('.')) {
      return {
        isValid: false,
        error: 'Invalid domain format',
        details: { type: 'invalid_domain' }
      };
    }

    // Check against basic regex pattern
    if (!EMAIL_REGEX.test(email)) {
      return {
        isValid: false,
        error: 'Invalid email format',
        details: { type: 'invalid_format' }
      };
    }

    // Check against strict regex pattern
    if (!STRICT_EMAIL_REGEX.test(email)) {
      return {
        isValid: false,
        error: 'Email contains invalid characters',
        details: { type: 'invalid_characters' }
      };
    }

    // Check for disposable email domains
    if (isDisposableEmail(email)) {
      return {
        isValid: false,
        error: 'Disposable email addresses are not allowed',
        details: { type: 'disposable_email' }
      };
    }

    // All checks passed
    return {
      isValid: true,
      error: null,
      details: {
        type: 'valid',
        localPart,
        domain
      }
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid email address',
      details: {
        type: 'error',
        message: error.message
      }
    };
  }
};

// Helper function to check for disposable email domains
const isDisposableEmail = (email) => {
  const disposableDomains = [
    'tempmail.com',
    'temp-mail.org',
    'guerrillamail.com',
    'throwawaymail.com',
    // Add more disposable email domains as needed
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.includes(domain);
};

// Helper function to check for common email providers
const isCommonEmailProvider = (email) => {
  const commonDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    // Add more common email domains as needed
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return commonDomains.includes(domain);
};

export { validateEmail, isDisposableEmail, isCommonEmailProvider };