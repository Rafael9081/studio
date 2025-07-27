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

export type Sale = {
  dogId: string;
  tutorId: string;
  price: number;
  date: Date;
};
