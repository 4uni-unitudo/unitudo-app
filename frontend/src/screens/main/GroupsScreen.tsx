import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import Header from '../../components/common/Header';

const GroupsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header title="Grupos" />
      <View style={styles.content}>
        <Text style={styles.text}>Conteúdo da tela de grupos em desenvolvimento</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  text: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
  },
});

export default GroupsScreen;
