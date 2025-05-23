import {ReactNode} from 'react';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import styles from './style';
import {ToastConfig, ToastConfigParams} from 'react-native-toast-message';
// Exportando a configuração para ser usada em App.tsx
interface CustomToastProps extends ToastConfigParams<any> {}

export const toastConfig: ToastConfig = {
  success: (props: CustomToastProps) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: styles.baseToastSucess.borderLeftColor}}
      contentContainerProps={{
        style: {
          paddingHorizontal: styles.baseToastSucess.paddingHorizontal,
          alignItems: styles.baseToastSucess.alignItems,
          justifyContent: styles.baseToastSucess.justifyContent,
        },
      }}
      text1Style={styles.sucessText1}
      text2Style={styles.sucessText2}
    />
  ),
  error: (props: CustomToastProps) => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: styles.baseToastError.borderLeftColor}}
      contentContainerProps={{
        style: {
          paddingHorizontal: styles.baseToastError.paddingHorizontal,
          alignItems: styles.baseToastError.alignItems,
          justifyContent: styles.baseToastError.justifyContent,
        },
      }}
      text1Style={styles.errorText1}
      text2Style={styles.errorText2}
    />
  ),
  info: (props: CustomToastProps) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: styles.baseToastInfo.borderLeftColor}}
      contentContainerProps={{
        style: {
          paddingHorizontal: styles.baseToastInfo.paddingHorizontal,
          alignItems: styles.baseToastInfo.alignItems,
          justifyContent: styles.baseToastInfo.justifyContent,
        },
      }}
      text1Style={styles.infoText1}
      text2Style={styles.infoText2}
    />
  ),
};

export function ToastProvider({children}: {children: ReactNode}) {
  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
}
