// Utility for secure logging in frontend that filters out sensitive data
const SENSITIVE_FIELDS = [
  'password', 'token', 'zoomLink', 'email', 'phone', 
  'address', 'userData', 'therapistData', 'image'
];

// Function to sanitize objects before logging
const sanitizeForLogging = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const sanitized = { ...obj };
  
  SENSITIVE_FIELDS.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

// Safe console log that filters sensitive data
const safeLog = (message, data = null) => {
  if (import.meta.env.DEV) {
    if (data) {
      console.log(message, sanitizeForLogging(data));
    } else {
      console.log(message);
    }
  }
};

// Safe console error that filters sensitive data
const safeError = (message, error = null) => {
  if (error) {
    console.error(message, sanitizeForLogging(error));
  } else {
    console.error(message);
  }
};

export { safeLog, safeError, sanitizeForLogging };
