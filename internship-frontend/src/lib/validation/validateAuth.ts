export const validateLogin = (
  accountName: string,
  password: string
): [string[], boolean] => {
  const errors: string[] = [];

  if (!accountName || accountName.trim().length === 0) {
    errors.push("Account name is required.");
  }

  if (!password || password.trim().length === 0) {
    errors.push("Password is required");
  }

  return [errors, errors.length === 0];
};

export const validateRegister = (
  accountName: string,
  password: string,
  confirmPassword: string,
  fullName: string,
  email: string,
  phone: string,
  address: string
): [string[], boolean] => {
  const errors: string[] = [];

  if (!accountName || accountName.trim().length === 0) {
    errors.push("Account name is required.");
  }

  if (!password || password.trim().length === 0) {
    errors.push("Password is required.");
  } else if (password.length < 6 || password.length > 100) {
    errors.push(
      "Password have to shorter than 100 characters & minimum characters is 6."
    );
  }

  if (password !== confirmPassword) {
    errors.push("The passwords do not match.");
  }

  if (!fullName || fullName.trim().length === 0) {
    errors.push("FullName is required.");
  } else if (fullName.length < 6) {
    errors.push("FullName need to at least 6 characters.");
  } else if (fullName.length > 50) {
    errors.push("FullName can't be longer than 50 characters.");
  }

  if (!email || email.trim().length === 0) {
    errors.push("Email is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email is not valid.");
  }

  if (!phone || phone.trim().length === 0) {
    errors.push("Phone number is required.");
  } else if (!/^(\+?\d{1,3})?0?\d{9}$/.test(phone)) {
    errors.push("Phone number is not valid.");
  }

  if (!address || address.trim().length === 0) {
    errors.push("Address is required.");
  } else if (address.length < 6) {
    errors.push("Address need to at least 6 characters.");
  } else if (address.length > 250) {
    errors.push("Address can't be longer than 250 characters.");
  }

  return [errors, errors.length === 0];
};
