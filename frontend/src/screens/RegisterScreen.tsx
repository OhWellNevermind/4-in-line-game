import NavigationBar from '@/components/ui/NavigationBar';
import React from 'react';
import Layout from './Layout';
import { AuthScreenNavigationProp } from '@/types/types';
import RegisterForm from '@/components/forms/RegisterForm';

type Props = {
  navigation: AuthScreenNavigationProp;
};

const RegisterScreen = ({ navigation }: Props) => {
  return (
    <Layout
      navigationComponent={
        <NavigationBar
          title="Register"
          onBack={() => {
            navigation.goBack();
          }}
        />
      }>
      <RegisterForm navigation={navigation} />
    </Layout>
  );
};

export default RegisterScreen;
