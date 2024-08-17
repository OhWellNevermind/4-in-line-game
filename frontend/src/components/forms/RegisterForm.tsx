import CustomTextInput from '@/components/ui/CustomInput';
import CustomTouchableOpacityButton from '@/components/ui/CustomTouchableOpacityButton';
import Typography from '@/components/ui/Typography';
import { useRegisterMutation } from '@/services/authApi';
import { TRegisterDTO } from '@/types/dtos';
import { AuthScreenNavigationProp } from '@/types/types';
import registerSchema from '@/utils/validation/registerSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

type Props = {
  navigation: AuthScreenNavigationProp;
};

const RegisterForm = ({ navigation }: Props) => {
  const [register] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterDTO>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: TRegisterDTO) => {
    await register(data);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.view}>
      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <CustomTextInput
            label="User name"
            onChangeText={field.onChange}
            value={field.value}
            placeholder="User name"
            error={errors.username?.message}
          />
        )}
      />
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
export default RegisterForm;
