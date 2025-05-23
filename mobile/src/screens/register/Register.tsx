import {SafeAreaView, StatusBar, TouchableOpacity, View} from 'react-native';
import CustomButton from '../../components/buttonComponent/CustomButton';
import CustomTitle from '../../components/TitleComponent/CustomTitle';
import CustomText from '../../components/textComponent/CustomText';
import {Input} from '../../components/inputComponent/CustomInput';
import {useState} from 'react';
import TextLink from '../../components/textLinkComponent/CustomTextLink';
import styles from './style';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {CaretLeft} from 'phosphor-react-native';
import {useTypedNavigation} from '../../hooks/useTypedNavigation';
import useAppContext from '../../hooks/useAppContext';
import {formatCPF} from '../../utils/formatCpf';
import KeyboardAvoidingContent from '../../components/keyboardAvoidingContentComponent/KeyboardAvoidingContent';

export default function RegisterScreen() {
  const navigation = useTypedNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [nomeCompletoError, setnomeCompletoError] = useState(false);
  const [cpfError, setcpfError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const {
    auth: {user, register},
  } = useAppContext();

  const handleRegister = async () => {
    // Reset erros
    let isValid = true;

    // Verify if the name is empty or invalid
    if (!name || name === '') {
      setnomeCompletoError(true);
      isValid = false;
    } else {
      setnomeCompletoError(false);
    }

    // Verify if the cpf is empty or invalid
    if (!cpf || cpf === '') {
      setcpfError(true);
      isValid = false;
    } else {
      setcpfError(false);
    }

    // Verify if the email is empty or invalid
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

    // Show error message if all fields are invalid
    if (!isValid) {
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Informe os campos obrigatórios corretamente!',
      });
    }

    if (isValid) {
      try {
        register(name, email, cpf, password);
        handleToLogin();
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Atenção',
          text2: user.message,
        });
      }
    }
  };

  const handleToLogin = () => {
    navigation.navigate('Login');
  };

  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <KeyboardAvoidingContent>
      <SafeAreaView style={styles.background}>
        <StatusBar
          backgroundColor={styles.background.backgroundColor}
          barStyle="dark-content"
        />
        <View style={styles.container}>
          <TouchableOpacity onPress={handleBack}>
            <CaretLeft size={30} weight="bold" />
          </TouchableOpacity>
          <View style={styles.header}>
            <CustomTitle>Crie Sua Conta</CustomTitle>
            <CustomText style={styles.subTitle}>
              Por favor preencha os dados para prosseguir!
            </CustomText>
          </View>
          <View style={styles.form}>
            <Input.Root isError={nomeCompletoError}>
              <Input.Label required>Nome Completo</Input.Label>
              <Input.Input
                placeholder="Ex.: Joao Pessoa"
                value={name}
                onChangeText={text => {
                  setName(text);
                  setnomeCompletoError(false);
                }}
              />
              <Input.ErrorMessage>
                Preencha o campo com seu nome completo!
              </Input.ErrorMessage>
            </Input.Root>
            <Input.Root isError={cpfError}>
              <Input.Label required>CPF</Input.Label>
              <Input.Input
                placeholder="Ex.: 111.111.1111-12"
                keyboardType="numeric"
                value={cpf}
                onChangeText={text => {
                  const formattedCPF = formatCPF(text);
                  setCpf(formattedCPF);
                  setcpfError(false);
                }}
              />
              <Input.ErrorMessage>
                Preencha o campo com seu CPF!
              </Input.ErrorMessage>
            </Input.Root>
            <Input.Root isError={emailError}>
              <Input.Label required>E-mail</Input.Label>
              <Input.Input
                placeholder="Ex.: nome@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setEmailError(false);
                }}
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
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setPasswordError(false);
                }}
              />
              <Input.ErrorMessage>
                Preencha o campo com sua senha!
              </Input.ErrorMessage>
            </Input.Root>
            <View style={styles.footer}>
              <CustomButton
                text="Cadastrar"
                variant="default"
                size="normal"
                onClick={handleRegister}
              />
              <TextLink
                onPress={handleToLogin}
                simpleText="Já possui uma conta?"
                boldText=" Login"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingContent>
  );
}
