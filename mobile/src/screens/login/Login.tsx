import {Image, SafeAreaView, StatusBar, View} from 'react-native';
import styles from './styles';
import CustomButton from '../../components/buttonComponent/CustomButton';
import CustomTitle from '../../components/TitleComponent/CustomTitle';
import CustomText from '../../components/textComponent/CustomText';
import {Input} from '../../components/inputComponent/CustomInput';
import {useState} from 'react';
import TextLink from '../../components/textLinkComponent/CustomTextLink';
import useAppContext from '../../hooks/useAppContext';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useTypedNavigation} from '../../hooks/useTypedNavigation';
import KeyboardAvoidingContent from '../../components/keyboardAvoidingContentComponent/KeyboardAvoidingContent';

const logo = require('../../../assets/images/Logo.png');

export default function LoginScreen() {
  const navigation = useTypedNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const {
    auth: {login},
  } = useAppContext();

  const handleLogin = async () => {
    // Reset erros
    let isValid = true;

    // Verify if the email and password are empty or invalid
    if (!email || !email.includes('@')) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    // Verify if the password is empty or under 6 characters
    if (!password || password.length < 6) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    // Show error message if both fields are invalid
    if (emailError === true && passwordError === true) {
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Informe os campos obrigatórios corretamente!',
      });
    }

    if (isValid) {
      try {
        login(email, password);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Atenção',
          text2: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingContent>
      <SafeAreaView style={styles.background}>
        <StatusBar
          backgroundColor={styles.background.backgroundColor}
          barStyle="dark-content"
        />
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.header}>
            <CustomTitle>Faça Login e comece a treinar</CustomTitle>
            <CustomText style={styles.subTitle}>
              Encontre parceiros para treinar ao ar livre. Conecte-se e comece
              agora! 💪
            </CustomText>
          </View>
          <View style={styles.form}>
            <Input.Root isError={emailError}>
              <Input.Label required>E-mail</Input.Label>
              <Input.Input
                placeholder="Ex.: nome@email.com"
                onChangeText={text => {
                  setEmail(text);
                  setEmailError(false);
                }}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input.ErrorMessage>
                Preencha o campo com seu e-mail!
              </Input.ErrorMessage>
            </Input.Root>
            <Input.Root isError={passwordError}>
              <Input.Label required>Senha</Input.Label>
              <Input.Input
                placeholder="******"
                autoCapitalize="none"
                autoComplete="off"
                secureTextEntry
                onChangeText={text => {
                  setPassword(text);
                  setPasswordError(false);
                }}
                value={password}
              />
              <Input.ErrorMessage>
                Preencha o campo com sua senha!
              </Input.ErrorMessage>
            </Input.Root>
            <View style={styles.footer}>
              <CustomButton
                text="Entrar"
                variant="default"
                size="normal"
                onClick={handleLogin}
              />
              <TextLink
                onPress={handleNavigateToRegister}
                simpleText="Ainda não tem uma conta?"
                boldText=" Cadastre-se"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingContent>
  );
}
