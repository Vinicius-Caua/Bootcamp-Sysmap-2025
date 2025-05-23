export const formatCPF = (value: string) => {
  // Remove non-numeric characters
  const cpfDigits = value.replace(/\D/g, '');

  // Limit to 11 digits
  const truncated = cpfDigits.slice(0, 11);

  // Apply formatting
  // Format the CPF as XXX.XXX.XXX-XX
  let formattedCPF = '';

  if (truncated.length <= 3) {
    formattedCPF = truncated;
  } else if (truncated.length <= 6) {
    formattedCPF = `${truncated.slice(0, 3)}.${truncated.slice(3)}`;
  } else if (truncated.length <= 9) {
    formattedCPF = `${truncated.slice(0, 3)}.${truncated.slice(
      3,
      6,
    )}.${truncated.slice(6)}`;
  } else {
    formattedCPF = `${truncated.slice(0, 3)}.${truncated.slice(
      3,
      6,
    )}.${truncated.slice(6, 9)}-${truncated.slice(9)}`;
  }

  return formattedCPF;
};
