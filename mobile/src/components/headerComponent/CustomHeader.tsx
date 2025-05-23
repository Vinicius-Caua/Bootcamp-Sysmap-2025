import {SafeAreaView, StatusBar, View} from 'react-native';
import styles from './styles';
import {ReactNode} from 'react';

interface CustomHeaderProps {
  height: number;
  borderBottomtRadius: number;
  children?: ReactNode;
}

export default function CustomHeader({
  height,
  borderBottomtRadius,
  children,
}: CustomHeaderProps) {
  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView
        style={[
          styles.header,
          {
            height: height,
            borderBottomLeftRadius: borderBottomtRadius,
            borderBottomRightRadius: borderBottomtRadius,
          },
        ]}>
        {/* Accept chieldrens inside */}
        <View style={styles.chieldrenView}>{children}</View>
      </SafeAreaView>
    </>
  );
}
