export type Dog = {
  id: string;
  name: string;
  breed: string;
  sex: 'Macho' | 'Fêmea';
  status: 'Disponível' | 'Vendido';
  tutorId?: string;
  salePrice?: number;
  dateOfSale?: Date;
  avatar?: string;
  birthDate?: Date;
  fatherId?: string;
  motherId?: string;
  observations?: string;
  specialCharacteristics?: string;
};

export type Tutor = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
};

export type Expense = {
  id: string;
  dogId: string;
  type: 'Alimentação' | 'Vacinas' | 'Veterinário' | 'Geral';
  amount: number;
  date: Date;
  description: string;
};

export type GeneralExpense = {
  id: string;
  type: 'Material' | 'Serviços' | 'Funcionários' | 'Outras';
  description: string;
  amount: number;
  date: Date;
};

export type Sale = {
  id: string;
  dogId: string;
  tutorId: string;
  price: number;
  date: Date;
};
