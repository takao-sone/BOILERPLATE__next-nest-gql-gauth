import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { FC } from 'react';
import AppCopyright from '../AppCopyright/AppCopyright';

type Props = {};

const AppFooter: FC<Props> = () => {
  return (
    <Box component="footer">
      <Stack direction="row" justifyContent="center" spacing={4} sx={{ mt: 2, mb: 1 }}>
        <StyledNextLink href="/app/terms-of-service">
          <Typography variant="body2">利用規約</Typography>
        </StyledNextLink>
        <StyledNextLink href="/app/privacy-policy">
          <Typography variant="body2">個人情報保護基本方針</Typography>
        </StyledNextLink>
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
