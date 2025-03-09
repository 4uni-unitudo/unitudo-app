// Componente Header modificado (src/components/common/Header.tsx)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // Calcular o padding superior para evitar a notch/câmera
  const topPadding = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24);
  
  return (
    <View 
      style={[
        styles.container, 
        { paddingTop: topPadding }
      ]}
    >
      <View style={styles.contentContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.darkGreen} />
          </TouchableOpacity>
        )}
        
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray.light,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    height: 56,
  },
  backButton: {
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.darkGreen,
  },
});

export default Header;
