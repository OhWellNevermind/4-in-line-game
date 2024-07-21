import Typography from '@/components/ui/Typography';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const ErrorMessage = ({ children }: Props) => {
  return (
    <Typography style={{ margin: 0 }} size="xs" color="error">
      {children}
    </Typography>
  );
};

export default ErrorMessage;
