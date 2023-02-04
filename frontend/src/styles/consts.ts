import { Theme } from '@mui/material/styles';

import { SxProps } from '@mui/material';

export const APP_SIDE_DRAWER_WIDTH_DESKTOP = 200;
export const APP_APP_BAR_HEIGHT = 64;
export const SX_BASE_DISPLAY: SxProps<Theme> = { display: { xs: 'none', md: 'block' } };
export const SX_NON_DESKTOP_DISPLAY: SxProps<Theme> = { display: { xs: 'block', md: 'none' } };
