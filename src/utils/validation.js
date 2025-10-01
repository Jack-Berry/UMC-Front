// src/utils/validation.js

// Name validation (first_name, last_name)
export function validateName(field, value, min = 2, max = 20) {
  if (!value.trim()) return `${field} is required.`;
  if (value.trim().length < min)
    return `${field} must be at least ${min} characters.`;
  if (value.trim().length > max)
    return `${field} cannot exceed ${max} characters.`;
  return null;
}

// Display name validation
export function validateDisplayName(value, min = 4, max = 20) {
  if (!value.trim()) return "Display name is required.";
  if (value.length < min)
    return `Display name must be at least ${min} characters.`;
  if (value.length > max)
    return `Display name cannot exceed ${max} characters.`;
  if (/\s/.test(value)) return "Display name cannot contain spaces.";
  if (!/^[A-Za-z0-9_]+$/.test(value))
    return "Display name may only contain letters, numbers, or underscores.";
  return null;
}

// Email validation
export function validateEmail(value) {
  if (!value.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Enter a valid email address.";
  return null;
}

// Password validation
export function validatePassword(value) {
  if (!value.trim()) return "Password is required.";
  const rules = {
    length: /.{8,}/,
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    special: /[^A-Za-z0-9]/,
  };
  const fails = Object.keys(rules).filter((rule) => !rules[rule].test(value));
  if (fails.length > 0) {
    return "Password must include 8+ chars, uppercase, lowercase, number, and special character.";
  }
  return null;
}

// Date of birth validation
export function validateDob(value) {
  if (!value) return "Date of birth is required.";
  const dob = new Date(value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  const isUnder18 =
    age < 18 ||
    (age === 18 && m < 0) ||
    (age === 18 && m === 0 && today.getDate() < dob.getDate());
  if (isUnder18) return "You must be at least 18 years old to register.";
  return null;
}
