import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  href: string;
};

const StyledNextLink = styled(NextLink)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: 'none',
}));

const AppNameLink: FC<Props> = ({ children, href }) => {
  return (
    <Typography component="span" noWrap sx={{ ml: 4, fontSize: '2rem', fontWeight: 'bold' }}>
      <StyledNextLink href={href}>{children}</StyledNextLink>
    </Typography>
  );
};

export default AppNameLink;
