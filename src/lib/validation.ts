export const validateEmail = (email: string) => {
  if (!email) return false;
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
};

export const validatePhone = (phone: string) => {
  if (!phone) return false;
  return /^(?:0|0094|\+94)?[0-9]{9}$/.test(phone.replace(/\s+/g, ''));
};
