import { Card, CardBody, CardHeader, Chip } from '@nextui-org/react';

interface StatCardProps {
  title: string;
  value: number;
  color: 'success' | 'secondary' | 'danger';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  className,
}) => {
  return (
    <Card className={`p-2 w-full ${className}`}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Chip
          className="capitalize border-none gap-1"
          color={color}
          size="sm"
          variant="dot"
        >
          <h2 className="md:text-xl text-lg">{title}</h2>
        </Chip>
      </CardHeader>
      <CardBody>
        <h1 className="md:text-4xl text-3xl text-end font-medium">{value}$</h1>
      </CardBody>
    </Card>
  );
};

export default StatCard;
