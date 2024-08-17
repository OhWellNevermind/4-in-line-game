import React from 'react';
import { AuthScreenNavigationProp } from '@/types/types';
import Layout from '@/screens/Layout';
import LoginForm from '@/components/forms/LoginForm';
import NavigationBar from '@/components/ui/NavigationBar';

type Props = {
  navigation: AuthScreenNavigationProp;
};

const AuthScreen = ({ navigation }: Props) => {
  return (
    <Layout
      navigationComponent={
        <NavigationBar
          title="Login"
          onBack={() => {
            navigation.navigate('Home');
          }}
        />
      }>
      <LoginForm navigation={navigation} />
    </Layout>
  );
};

export default AuthScreen;
