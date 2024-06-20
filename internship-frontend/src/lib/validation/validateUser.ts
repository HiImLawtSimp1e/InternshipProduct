export const validateAddUser = (
  accountName: string,
  password: string,
  fullName: string,
  email: string,
  phone: string,
  address: string
): [string[], boolean] => {
  let errors: string[] = [];

  // AccountName validation
  const accountNameError = validateRequired(accountName, "Account name");
  if (accountNameError) errors.push(accountNameError);
  else {
    const accountNameError = validateLength(
      accountName,
      "Account name",
      6,
      100
    );
    if (accountNameError) errors.push(accountNameError);
  }

  // Password validation
  const passwordRequiredError = validateRequired(password, "Password");
  if (passwordRequiredError) errors.push(passwordRequiredError);
  else {
    const passwordLengthError = validateLength(password, "Password", 6, 100);
    if (passwordLengthError) errors.push(passwordLengthError);
  }

  // FullName validation
  const fullNameRequiredError = validateRequired(fullName, "FullName");
  if (fullNameRequiredError) errors.push(fullNameRequiredError);
  else {
    const fullNameLengthError = validateLength(fullName, "FullName", 6, 50);
    if (fullNameLengthError) errors.push(fullNameLengthError);
  }

  // Email validation
  const emailRequiredError = validateRequired(email, "Email");
  if (emailRequiredError) errors.push(emailRequiredError);
  else {
    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);
  }

  // Phone validation
  const phoneRequiredError = validateRequired(phone, "Phone number");
  if (phoneRequiredError) errors.push(phoneRequiredError);
  else {
    const phoneError = validatePhone(phone);
    if (phoneError) errors.push(phoneError);
  }

  // Address validation
  const addressRequiredError = validateRequired(address, "Address");
  if (addressRequiredError) errors.push(addressRequiredError);
  else {
    const addressLengthError = validateLength(address, "Address", 6, 250);
    if (addressLengthError) errors.push(addressLengthError);
  }

  return [errors, errors.length === 0];
};

export const validateUpdateUser = (
  fullName: string,
  email: string,
  phone: string,
  address: string
): [string[], boolean] => {
  let errors: string[] = [];

  // FullName validation (optional)
  if (fullName.trim().length > 0) {
    const fullNameLengthError = validateLength(fullName, "FullName", 6, 50);
    if (fullNameLengthError) errors.push(fullNameLengthError);
  }

  // Email validation
  const emailRequiredError = validateRequired(email, "Email");
  if (emailRequiredError) errors.push(emailRequiredError);
  else {
    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);
  }

  // Phone validation
  const phoneRequiredError = validateRequired(phone, "Phone number");
  if (phoneRequiredError) errors.push(phoneRequiredError);
  else {
    const phoneError = validatePhone(phone);
    if (phoneError) errors.push(phoneError);
  }

  // Address validation
  const addressRequiredError = validateRequired(address, "Address");
  if (addressRequiredError) errors.push(addressRequiredError);
  else {
    const addressLengthError = validateLength(address, "Address", 6, 250);
    if (addressLengthError) errors.push(addressLengthError);
  }

  return [errors, errors.length === 0];
};

const validateRequired = (value: string, fieldName: string): string | null => {
  return value.trim().length === 0 ? `${fieldName} is required.` : null;
};

const validateLength = (
  value: string,
  fieldName: string,
  min: number,
  max: number
): string | null => {
  if (value.trim().length < min || value.trim().length > max) {
    return `${fieldName} must be between ${min} and ${max} characters long.`;
  }
  return null;
};

const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !email.match(emailRegex) ? "Email is not valid." : null;
};

const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^(\+?\d{1,3})?0?\d{9}$/;
  return !phone.match(phoneRegex) ? "Phone number is not valid." : null;
};
