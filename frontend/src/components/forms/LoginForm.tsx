import CustomTextInput from '@/components/ui/CustomInput';
import CustomTouchableOpacityButton from '@/components/ui/CustomTouchableOpacityButton';
import Typography from '@/components/ui/Typography';
import { useLoginMutation } from '@/services/authApi';
import { TLoginDTO } from '@/types/dtos';
import { AuthScreenNavigationProp } from '@/types/types';
import loginSchema from '@/utils/validation/loginSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

type Props = {
  navigation: AuthScreenNavigationProp;
};

const LoginForm = ({ navigation }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<TLoginDTO>({
    resolver: yupResolver(loginSchema),
  });

  const [login] = useLoginMutation();

  const onSubmit = async (data: TLoginDTO) => {
    await login(data);
    // navigation.navigate('Home');
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
      <CustomTouchableOpacityButton
        onPress={() => {
          clearErrors();
          navigation.navigate('Register');
        }}>
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
