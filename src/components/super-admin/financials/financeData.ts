export interface Transaction {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  event: string;
  method: 'Card' | 'Transfer' | 'Cash';
  status: 'DEPOSIT PAID' | 'BALANCE PAID' | 'REFUND ISSUED' | 'PENDING';
  amount: number;
}

export interface RefundRequest {
  id: string;
  clientName: string;
  requestedTime: string;
  amount: number;
}

export const transactionsData: Transaction[] = [
  {
    id: '#TXN-90218',
    date: 'Oct 24, 2023',
    clientId: 'Julianne Aristhor',
    clientName: 'Julianne Aristhor',
    event: 'Winter Wedding Gala',
    method: 'Card',
    status: 'DEPOSIT PAID',
    amount: 12500.00
  },
  {
    id: '#TXN-90198',
    date: 'Oct 22, 2023',
    clientId: 'The Harrison Foundation',
    clientName: 'The Harrison Foundation',
    event: 'Annual Philanthropy Dinner',
    method: 'Transfer',
    status: 'BALANCE PAID',
    amount: 45000.00
  },
  {
    id: '#TXN-89442',
    date: 'Oct 20, 2023',
    clientId: 'Marcus Vane',
    clientName: 'Marcus Vane',
    event: 'Private Yacht Soirée (Cancelled)',
    method: 'Card',
    status: 'REFUND ISSUED',
    amount: -2200.00
  },
  {
    id: '#TXN-89331',
    date: 'Oct 18, 2023',
    clientId: 'Elena Rossi',
    clientName: 'Elena Rossi',
    event: 'Vogue Italy Photoshoot',
    method: 'Cash',
    status: 'PENDING',
    amount: 8400.00
  }
];

export const refundQueueData: RefundRequest[] = [
  {
    id: '#RE-4451',
    clientName: 'Clara M.',
    requestedTime: 'Requested 2h ago',
    amount: 1400.00
  },
  {
    id: '#RE-4449',
    clientName: 'Thomas R.',
    requestedTime: 'Requested 5h ago',
    amount: 3200.00
  }
];

export const revenueCategoryData = [
  { label: 'VENUE HIRE', percentage: 65, color: '#7C6A2E' },
  { label: 'CONCIERGE', percentage: 20, color: '#F1D570' },
  { label: 'CATERING', percentage: 15, color: '#82A0F6' }
];
