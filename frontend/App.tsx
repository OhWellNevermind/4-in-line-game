import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/stores/store';
import setup from '@/services/setupInterceptors';
import RootNavigator from '@/components/navigation/RootNavigator';

const App = () => {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

setup(store);

export default App;
