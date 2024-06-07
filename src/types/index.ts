import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Transaction {
  id: number;
  date: any;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}
