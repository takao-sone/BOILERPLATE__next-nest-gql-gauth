import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { FC } from 'react';
import AppCopyright from '../AppCopyright/AppCopyright';

type Props = {};

const AppFooter: FC<Props> = () => {
  return (
    <Box component="footer">
      <Stack direction="row" justifyContent="center" spacing={4} sx={{ mt: 2, mb: 1 }}>
        <StyledNextLink href="/">利用規約</StyledNextLink>
        <StyledNextLink href="/">個人情報保護基本方針</StyledNextLink>
      </Stack>
      <AppCopyright />
    </Box>
  );
};

const StyledNextLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.light,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

export default AppFooter;
