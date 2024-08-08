export const validateAddress = (
  fullName: string,
  email: string,
  phone: string,
  address: string
): [string[], boolean] => {
  const errors: string[] = [];

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
