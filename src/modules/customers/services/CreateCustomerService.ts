import { NextFunction, Request, Response } from 'express';
import CustomerRepository from '../repositories/CustomerRepository';
import validator from 'validator';

const customerClassRepository = new CustomerRepository();

function isValidPhone(phone: string): boolean {
  return validator.isMobilePhone(phone, ['pt-BR']);
}

function isValidDate(birthDate: string): boolean {
  return validator.isDate(birthDate, { format: 'DD/MM/YYYY' });
}

const isValidCpf = (cpf: string): boolean => {
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
class CreateCustomerService {
  async validateCustomer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { fullName, birthDate, cpf, email, phone } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.length < 3) {
      res.status(400).json({
        message: 'Name must be letters and must be more than 3 letters',
      });
      return;
    }

    if (!birthDate) {
      res.status(400).json({ message: 'Birth date id required' });
      return;
    } else if (!isValidDate(birthDate)) {
      res.status(400).json({ message: 'Send a valid date' });
      return;
    }

    if (!cpf) {
      res.status(400).json({ message: 'CPF is required' });
      return;
    } else if (!isValidCpf(cpf)) {
      res.status(400).json({ message: 'Send a valid CPF' });
      return;
    }

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    } else if (!validator.isEmail(email)) {
      res.status(400).json({ message: 'Send a valid email' });
      return;
    }

    if (!phone) {
      res.status(400).json({ message: 'Phone is required' });
      return;
    } else if (!isValidPhone(phone)) {
      res.status(400).json({ message: 'Send a valid phone number' });
      return;
    }

    const customerExistsCpf =
      await customerClassRepository.findCustomerByCpf(cpf);
    if (customerExistsCpf) {
      res
        .status(400)
        .json({ message: 'A customer with this CPF already exists.' });
      return;
    }

    const customerExistsEmail =
      await customerClassRepository.findCustomerByEmail(email);
    if (customerExistsEmail) {
      res
        .status(400)
        .json({ message: 'A customer with this email already exists.' });
      return;
    }

    const [day, month, year] = birthDate.split('/');
    req.body.birthDate = new Date(`${year}-${month}-${day}`);
    next();
  }
}

export default CreateCustomerService;
