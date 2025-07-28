export type Dog = {
  id: string;
  name: string;
  breed: string;
  sex: 'Macho' | 'Fêmea';
  status: 'Disponível' | 'Vendido' | 'Gestante';
  tutorId?: string;
  salePrice?: number;
  dateOfSale?: Date;
  avatar?: string;
  birthDate?: Date;
  fatherId?: string;
  motherId?: string;
  observations?: string;
  specialCharacteristics?: string;
  matingDate?: Date; // Kept for simplicity, but new events are preferred
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

export type Activity = {
    id: string;
    type: 'dog_added' | 'sale_added' | 'expense_added' | 'general_expense_added' | 'event_added';
    title: string;
    description: string;
    date: Date;
    link: string;
    avatarUrl?: string;
    amount?: number;
    entityId: string;
}

export type DogEvent = {
  id: string;
  dogId: string;
  type: 'Cio' | 'Monta' | 'Parto' | 'Vacina' | 'Vermifugação' | 'Consulta Veterinária' | 'Doença/Tratamento' | 'Pesagem';
  date: Date;
  notes?: string;
  partnerId?: string; // For mating events
  partnerName?: string; // For mating events
  puppyCount?: number; // For birth events
  weight?: number; // For weight records
}
