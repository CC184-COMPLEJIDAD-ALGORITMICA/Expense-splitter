export interface User {
    id: string;
    username: string;
    isNewUser?: boolean;
}

export interface JuntaExpense {
    id: string;
    description: string;
    amount: number;
    paidBy: string;
    splitAmong: string;
    juntaId: string;
    createdAt: Date | string;
}

export interface Junta {
    id: string;
    name: string;
    ownerId: string;
    members: User[];
    expenses: JuntaExpense[];
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    paidBy: string;
    splitAmong: string;
    isLocal: boolean;
    userId: string;
    createdAt: Date;
}

export interface Invitation {
    id: string;
    juntaId: string;
    invitedUserId: string;
    inviterId: string;
    status: string;
    junta: {
        id: string;
        name: string;
    };
    inviter: {
        id: string;
        username: string;
    };
}

export type ActionData = 
  | { success: true; expense: Omit<Expense, 'createdAt'> & { createdAt: string } }
  | { success: true; deletedExpenseId: string }
  | { success: true; junta: Omit<Junta, 'expenses'> & { expenses: (Omit<JuntaExpense, 'createdAt'> & { createdAt: string })[] } }
  | { success: true; message: string; juntaId?: string }
  | { success: false; error: string }
  | { success: false; message: string };  // Añade esta línea

export type AnyExpense = Expense | JuntaExpense;

export interface Split {
    from: string;
    to: string;
    amount: number;
}