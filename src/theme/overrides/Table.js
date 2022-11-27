// ----------------------------------------------------------------------

export default function Table(theme) {
  return {
    MuiTableCell: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        head: {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.neutral,
        },
      },
    },
  };
}
