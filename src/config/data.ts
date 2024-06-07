// const columns = [
//   { name: 'DATE', uid: 'date' },
//   { name: 'TITLE', uid: 'title' },
//   { name: 'AMAUNT', uid: 'amaunt' },
//   { name: 'STATUS', uid: 'status' },
//   { name: 'ACTIONS', uid: 'actions' },

import { Transaction } from '@/types';

// ];
const columns = [
  { name: 'Date', uid: 'date', sortable: true },
  { name: 'Title', uid: 'title', sortable: true },
  { name: 'Amount', uid: 'amount', sortable: true },
  { name: 'Type', uid: 'type', sortable: true },
  { name: 'Category', uid: 'category', sortable: true },
  { name: 'Actions', uid: 'actions', sortable: false },
];

// const initialTransactions: Transaction[] = [
//   {
//     id: 1,
//     date: '2024-05-30',
//     title: 'Salary',
//     amount: 5000,
//     type: 'income',
//     category: 'Job',
//   },
//   {
//     id: 2,
//     date: '2024-05-29',
//     title: 'Groceries',
//     amount: 50,
//     type: 'expense',
//     category: 'Food',
//   },
//   {
//     id: 3,
//     date: '2024-05-28',
//     title: 'Electricity Bill',
//     amount: 100,
//     type: 'expense',
//     category: 'Utilities',
//   },
//   {
//     id: 4,
//     date: '2024-05-27',
//     title: 'Freelance Project',
//     amount: 800,
//     type: 'income',
//     category: 'Job',
//   },
//   {
//     id: 5,
//     date: '2024-05-26',
//     title: 'Gym Membership',
//     amount: 30,
//     type: 'expense',
//     category: 'Health',
//   },
//   {
//     id: 6,
//     date: '2024-05-25',
//     title: 'Internet Bill',
//     amount: 40,
//     type: 'expense',
//     category: 'Utilities',
//   },
//   {
//     id: 7,
//     date: '2024-05-24',
//     title: 'Dinner',
//     amount: 60,
//     type: 'expense',
//     category: 'Food',
//   },
//   {
//     id: 8,
//     date: '2024-05-23',
//     title: 'Project Bonus',
//     amount: 200,
//     type: 'income',
//     category: 'Job',
//   },
// ];

const statusOptions = [
  { name: 'income', uid: 'income' },
  { name: 'expense', uid: 'expense' },
];

const types = [
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
];

export { columns, statusOptions, types };

export const animals = [
  { key: 'cat', label: 'Cat' },
  { key: 'dog', label: 'Dog' },
  { key: 'elephant', label: 'Elephant' },
  { key: 'lion', label: 'Lion' },
  { key: 'tiger', label: 'Tiger' },
  { key: 'giraffe', label: 'Giraffe' },
  { key: 'dolphin', label: 'Dolphin' },
  { key: 'penguin', label: 'Penguin' },
  { key: 'zebra', label: 'Zebra' },
  { key: 'shark', label: 'Shark' },
  { key: 'whale', label: 'Whale' },
  { key: 'otter', label: 'Otter' },
  { key: 'crocodile', label: 'Crocodile' },
];

function getRandomPastDate(): Date {
  const today = new Date();
  const randomPastDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    Math.floor(Math.random() * today.getDate())
  );

  return randomPastDate;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateDummyData(count: number): Transaction[] {
  const titles = [
    'Salary',
    'Groceries',
    'Electricity Bill',
    'Freelance Project',
    'Gym Membership',
    'Internet Bill',
    'Dinner',
    'Project Bonus',
    'Coffee',
    'Book Purchase',
    'Gift',
  ];
  const categories = [
    'Job',
    'Food',
    'Utilities',
    'Health',
    'Entertainment',
    'Gift',
  ];
  const types: ('income' | 'expense')[] = ['income', 'expense'];

  const transactions: Transaction[] = [];

  for (let i = 1; i <= count; i++) {
    const type = getRandomElement(types);
    const amount =
      type === 'income'
        ? Math.floor(Math.random() * 5000) + 100
        : Math.floor(Math.random() * 200) + 1;

    transactions.push({
      id: i,
      date: getRandomPastDate(),
      title: getRandomElement(titles),
      amount: amount,
      type: type,
      category: getRandomElement(categories),
    });
  }

  return transactions;
}
