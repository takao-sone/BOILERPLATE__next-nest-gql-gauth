import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { FC, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  title: string;
};

const AppBaseCard: FC<Props> = ({ children, title }) => {
  return (
    <Card>
      <CardHeader title={title} />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AppBaseCard;
