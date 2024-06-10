export const validateUser = (
  username: string,
  email: string,
  password: string,
  phone: string,
  address: string
): [string[], boolean] => {
  let errors: string[] = [];

  if (username.trim().length === 0) {
    errors.push("Username is required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.match(emailRegex)) {
    errors.push("Please enter a valid email address.");
  }

  if (password.trim().length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phone.match(phoneRegex)) {
    errors.push("Please enter a valid phone number.");
  }

  if (address.trim().length === 0) {
    errors.push("Address is required.");
  }

  return [errors, errors.length === 0];
};
