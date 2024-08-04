import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

type Orientation = 'portrait' | 'landscape';

const useOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  const updateOrientation = ({ window }: { window: ScaledSize }) => {
    if (window.width > window.height) {
      setOrientation('landscape');
    } else {
      setOrientation('portrait');
    }
  };

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    updateOrientation({ window: { width, height, scale: 1, fontScale: 1 } });

    const subscription = Dimensions.addEventListener(
      'change',
      updateOrientation,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return orientation;
};

export default useOrientation;
