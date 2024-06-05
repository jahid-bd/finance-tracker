import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Transaction {
  id: number;
  date: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}
