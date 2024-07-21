import CustomTextInput from '@/components/ui/CustomInput';
import CustomTouchableOpacityButton from '@/components/ui/CustomTouchableOpacityButton';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Typography from '@/components/ui/Typography';
import { TLoginDTO } from '@/types/dtos';
import loginSchema from '@/utils/validation/loginSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, View } from 'react-native';

type Props = {};

const LoginForm = ({}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<TLoginDTO>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: TLoginDTO) => {
    console.log(data);
  };

  return (
    <View style={styles.view}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <CustomTextInput
            label="Email"
            onChangeText={field.onChange}
            value={field.value}
            placeholder="Email"
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <CustomTextInput
            label="Password"
            onChangeText={field.onChange}
            value={field.value}
            placeholder="Password"
            secureTextEntry
          />
        )}
      />
      <CustomTouchableOpacityButton onPress={handleSubmit(onSubmit)}>
        <Typography>Login</Typography>
      </CustomTouchableOpacityButton>
      <CustomTouchableOpacityButton onPress={() => clearErrors()}>
        <Typography>Register</Typography>
      </CustomTouchableOpacityButton>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    gap: 12,
  },
});
export default LoginForm;
