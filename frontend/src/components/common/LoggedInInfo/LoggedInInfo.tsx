import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { GoogleIdentity } from 'components/common/GoogleIdentity';
import { AuthUser } from 'global-states/auth-user.state';
import { FC } from 'react';

type Props = {
  authUser: AuthUser;
};

const LoggedInInfo: FC<Props> = ({ authUser }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="p">
        以下ユーザーでログイン済みです
      </Typography>
      <Grid container columnSpacing={{ xs: 1, sm: 2 }}>
        <Grid item xs={12} sm={4}>
          <Typography>ユーザーID:</Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography>{authUser.displayedId}</Typography>
        </Grid>
      </Grid>
      <Grid container columnSpacing={{ xs: 1, sm: 2 }}>
        <Grid item xs={12} sm={4}>
          <Typography>ユーザーネーム:</Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography>{authUser.userProfile.name}</Typography>
        </Grid>
      </Grid>
      <GoogleIdentity buttonType="REGISTER" />
    </Stack>
  );
};

export default LoggedInInfo;
