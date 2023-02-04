import { Card, CardContent, CardHeader, Divider } from '@mui/material';
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
