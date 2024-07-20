import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthScreenNavigationProp } from '@/types/types';
import Layout from '@/screens/Layout';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from '@/utils/validation/loginSchema';
import { TLoginDTO } from '@/types/dtos';

type Props = {
  navigation: AuthScreenNavigationProp;
};

const AuthScreen = ({ navigation }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginDTO>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: TLoginDTO) => {
    console.log(data);
  };

  return (
    <Layout>
      <View>
        <Button onPress={() => navigation.navigate('Home')} title="Go back" />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput
              onChangeText={field.onChange}
              value={field.value}
              placeholder="Email"
            />
          )}
        />
        {errors.email?.message && (
          <Text>Ya poppin dude, get that email in 'ere</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextInput
              onChangeText={field.onChange}
              value={field.value}
              placeholder="Password"
              secureTextEntry
            />
          )}
        />
        <Button onPress={handleSubmit(onSubmit)} title="Submit" />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({});
export default AuthScreen;
