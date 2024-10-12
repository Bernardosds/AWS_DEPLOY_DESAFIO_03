
export const isValidCpf = (cpf: string): boolean  => {
    cpf = cpf.replace(/[^\d]+/g, '');
   
    if (cpf.length !== 11) return false;
   
    if (/^(\d)\1{10}$/.test(cpf)) return false;
   
    const calculateDigit = (digits: string): number => {
      let sum = 0;
      for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i]) * (digits.length + 1 - i);
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };
   
    const firstDigit = calculateDigit(cpf.substring(0, 9));
    if (firstDigit !== parseInt(cpf[9])) return false;
   
    const secondDigit = calculateDigit(cpf.substring(0, 10));
    if (secondDigit !== parseInt(cpf[10])) return false;
   
    return true;
};
