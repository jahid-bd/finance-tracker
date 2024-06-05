import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import React from 'react';

interface FormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formState: FormState;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: () => void;
  types: { key: string; label: string }[];
  isToUpdate?: boolean;
}

interface FormState {
  title: string;
  type: string;
  category: string;
  amount: string;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  formState,
  handleChange,
  handleSubmit,
  types,
  isToUpdate = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="max-md:max-w-[90%] mx-auto"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className="flex items-center flex-col gap-5">
              <Input
                type="text"
                label="Title"
                labelPlacement="outside"
                placeholder="title"
                name="title"
                onChange={handleChange}
                value={formState.title}
              />
              <Select
                label="Type"
                placeholder="Select type"
                className=""
                selectedKeys={[formState.type]}
                name="type"
                onChange={handleChange}
                labelPlacement="outside"
              >
                {types.map((type) => (
                  <SelectItem key={type.key}>{type.label}</SelectItem>
                ))}
              </Select>

              <Input
                type="text"
                label="Category"
                labelPlacement="outside"
                placeholder="Category"
                name="category"
                onChange={handleChange}
                value={formState.category}
              />

              <Input
                type="number"
                label="Amount"
                placeholder="0"
                labelPlacement="outside"
                min={0}
                name="amount"
                value={formState.amount}
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
                onChange={handleChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>

              <Button
                className="bg-foreground text-background"
                color="primary"
                onPress={handleSubmit}
              >
                {isToUpdate ? 'Update' : 'Add Transaction'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
