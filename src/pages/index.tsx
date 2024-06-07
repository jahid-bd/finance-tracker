import FormModal from '@/components/form-modal';
import {
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  VerticalDotsIcon,
} from '@/components/icons';
import StatCard from '@/components/stat-card';
import {
  columns,
  generateDummyData,
  statusOptions,
  types,
} from '@/config/data';
import { Transaction } from '@/types';
import { DateValue } from '@internationalized/date';
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const typeColorMap: Record<string, ChipProps['color']> = {
  income: 'success',
  expense: 'danger',
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface FormState {
  id: number | '';
  title: string;
  amount: string;
  type: 'income' | 'expense' | '';
  category: string;
  date: DateValue | string;
}

const INITIAL_VISIBLE_COLUMNS = [
  'date',
  'title',
  'amount',
  'type',
  'category',
  'actions',
];

export default function App() {
  // states
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');

    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // filter state
  const [filterValue, setFilterValue] = React.useState('');

  // table colums state
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  // category filter state
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');

  // sorting state
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'date',
    direction: 'descending',
  });

  // pagination state
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(transactions.length / rowsPerPage);

  // serach filter
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // filtering logic
  const filteredItems = React.useMemo(() => {
    let filteredTrans = [...transactions];

    if (hasSearchFilter) {
      filteredTrans = filteredTrans.filter(
        (trans) =>
          trans.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          trans.category.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredTrans = filteredTrans.filter((trans) =>
        Array.from(statusFilter).includes(trans.type)
      );
    }

    return filteredTrans;
  }, [filterValue, statusFilter, transactions]);

  //
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage, transactions]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Transaction, b: Transaction) => {
      const first = a[sortDescriptor.column as keyof Transaction] as number;
      const second = b[sortDescriptor.column as keyof Transaction] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'ascending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items, transactions]);

  const renderCell = React.useCallback(
    (transaction: Transaction, columnKey: React.Key) => {
      const cellValue = transaction[columnKey as keyof Transaction];

      switch (columnKey) {
        case 'title':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case 'type':
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={typeColorMap[transaction.type]}
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
          );
        case 'actions':
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {/* <DropdownItem>
                  <div className="flex items-center gap-1">
                    <span>
                      <EyeIcon />
                    </span>
                    <span>View</span>
                  </div>
                </DropdownItem> */}
                  <DropdownItem
                    onClick={() => handleClickUpdate(transaction.id)}
                  >
                    <div className="flex items-center gap-1">
                      <span>
                        <EditIcon />
                      </span>
                      <span>Edit</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => handleDelete(transaction.id)}>
                    <div className="flex items-center gap-1">
                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        <DeleteIcon />
                      </span>
                      <span> Delete</span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [transactions]
  );

  // handlers

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [formState, setFormState] = useState<FormState>({
    id: '',
    title: '',
    amount: '',
    type: '',
    category: '',
    date: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add transacton item

  const resetForm = useCallback(() => {
    setFormState({
      id: '',
      title: '',
      amount: '',
      type: '',
      category: '',
      date: '',
    });
  }, []);

  const handleAddTransaction = () => {
    if (isToUpdate) {
      const indexToUpdate = transactions.findIndex(
        (t) => t.id === formState.id
      );

      if (indexToUpdate !== -1) {
        const updatedTransactions = [...transactions];
        updatedTransactions[indexToUpdate] = {
          id: formState.id as number,
          title: formState.title,
          amount: parseFloat(formState.amount),
          type: formState.type as 'income' | 'expense',
          category: formState.category,
          date: updatedTransactions[indexToUpdate].date,
        };

        setTransactions(updatedTransactions);
        toast.success('Transaction updated successfully');

        onClose();
      }
    } else {
      const date = new Date();
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        date: formatDate(date),
        title: formState.title,
        amount: parseFloat(formState.amount),
        type: formState.type as 'income' | 'expense',
        category: formState.category,
      };

      setTransactions((prevTransactions) => [
        ...prevTransactions,
        newTransaction,
      ]);

      resetForm();
      onClose();
      toast.success('Transaction created successfully');
    }
  };

  // Delete transaction item
  const handleDelete = (id: number) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(updatedTransactions);

    toast.success('Transaction deleted successfully');
  };

  // update transaction item
  const [isToUpdate, setIsToUpdate] = useState(false);

  const handleClickUpdate = useCallback(
    (id: number) => {
      setIsToUpdate(true);
      const selectedItem = transactions.find((item) => item.id === id);

      if (selectedItem) {
        setFormState({
          id: selectedItem?.id as number,
          title: selectedItem?.title,
          amount: selectedItem?.amount.toString(),
          type: selectedItem?.type,
          category: selectedItem?.category,
          date: selectedItem?.date,
        });
      }
      onOpen();
    },
    [transactions]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: 'w-full sm:max-w-[44%]',
              inputWrapper: 'border-1',
            }}
            placeholder="Search by title or category..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue('')}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((type) => (
                  <DropdownItem key={type.uid} className="capitalize">
                    {capitalize(type.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon />}
              size="sm"
              onPress={() => {
                resetForm();
                setIsToUpdate(false);
                onOpen();
              }}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} transactions
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    transactions,
  ]);

  // stats calulation

  const totalIncome = useMemo(() => {
    return filteredItems.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        return acc + transaction.amount;
      }
      return acc;
    }, 0);
  }, [transactions, filteredItems, onSearchChange]);

  const totalExpenses = useMemo(() => {
    return filteredItems.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        return acc + transaction.amount;
      }
      return acc;
    }, 0);
  }, [transactions, filteredItems]);

  const balance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  // Save transaction in local storage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (!transactions.length) {
      const data = generateDummyData(10);
      setTransactions(data);
    }
  }, []);

  console.log(transactions);

  return (
    <main>
      <div className="mb-10 grid md:grid-cols-3 gap-4">
        <StatCard title="Balance" value={balance} color="secondary" />
        <StatCard title="Income" value={totalIncome} color="success" />
        <StatCard
          title="Expense"
          value={Math.abs(totalExpenses)}
          color="danger"
        />
      </div>
      <div className="w-full overflow-hidden">
        <Table
          isCompact
          aria-label="Transaction table with custom cells, pagination and sorting"
          selectionMode="single"
          bottomContent={
            <Pagination
              showControls
              isCompact
              // classNames={{
              //   base: 'py-2',
              //   wrapper: 'justify-end',
              //   cursor: 'text-sm',
              //   prev: 'text-sm',
              //   next: 'text-sm',
              //   item: 'text-sm',
              // }}
              classNames={{
                cursor: 'bg-foreground text-background',
              }}
              color="default"
              page={page}
              total={pages}
              variant="light"
              onChange={(page) => setPage(page)}
            />
          }
          // classNames={{
          //   base: 'min-h-[440px]',
          //   table: 'min-h-[400px]',
          // }}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column: any) => (
              <TableColumn
                key={column.uid}
                allowsSorting={column.sortable}
                align={'center'}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent="No transactions found">
            {sortedItems.map((trans) => (
              <TableRow key={trans.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(trans, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FormModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={isToUpdate ? 'Update Transaction' : 'Add New Transaction'}
        formState={formState}
        handleChange={handleChange}
        handleSubmit={handleAddTransaction}
        types={types}
        isToUpdate={isToUpdate}
      />
    </main>
  );
}
