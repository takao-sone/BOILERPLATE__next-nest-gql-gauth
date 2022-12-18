import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { FC, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  cardTitle: string;
};

const AppBaseCard: FC<Props> = ({ children, cardTitle }) => {
  return (
    <Card>
      <CardHeader title={cardTitle} />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AppBaseCard;
