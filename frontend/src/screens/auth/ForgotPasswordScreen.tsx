import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Header from '../../components/common/Header';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!email) {
      setError('Email é obrigatório');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return false;
    }
    
    setError(undefined);
    return true;
  };

  const handleResetPassword = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulando uma chamada de API
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
          'Email enviado',
          'Enviamos instruções para redefinir sua senha para o email informado.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <Header title="Esqueci minha senha" showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.description}>
          Digite seu email acadêmico e enviaremos instruções para redefinir sua senha.
        </Text>

        <View style={styles.formContainer}>
          <Input
            label="Email acadêmico"
            value={email}
            onChangeText={setEmail}
            placeholder="seu.email@universidade.edu.br"
            keyboardType="email-address"
            error={error}
          />
          
          <Button
            title="Enviar instruções"
            onPress={handleResetPassword}
            style={styles.submitButton}
            loading={isSubmitting}
          />
          
          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToLoginText}>Voltar para o login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  backToLoginText: {
    fontSize: typography.fontSize.md,
    color: colors.teal,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
