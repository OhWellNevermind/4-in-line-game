import React from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';

import Field from '@/components/board/Field';
import { BoardScreenNavigationProp } from '@/types/types';
import Layout from '@/screens/Layout';

type Props = {
  navigation: BoardScreenNavigationProp;
};

const BoardPage = ({ navigation }: Props) => {
  return (
    <Layout>
      <Field />
      <Button onPress={() => navigation.navigate('Home')} title="Go back" />
    </Layout>
  );
};

export default BoardPage;
