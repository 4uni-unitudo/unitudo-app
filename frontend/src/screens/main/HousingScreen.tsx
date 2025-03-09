import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

interface HousingOption {
  id: string;
  type: 'room' | 'apartment';
  title: string;
  address: string;
  distance: string;
  price: string;
  features: string[];
  images: string[];
}

const HousingScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'room' | 'apartment'>('all');

  // Dados simulados para exibição
  const housingOptions: HousingOption[] = [
    {
      id: '1',
      type: 'room',
      title: 'Quarto individual próximo à universidade',
      address: 'Rua das Flores, 123',
      distance: '500m da universidade',
      price: 'R$ 600/mês',
      features: ['Mobiliado', 'Internet', 'Água e luz inclusos'],
      images: ['https://via.placeholder.com/300x200'],
    },
    {
      id: '2',
      type: 'apartment',
      title: 'Apartamento para compartilhar (3 quartos)',
      address: 'Av. Principal, 456',
      distance: '1km da universidade',
      price: 'R$ 500/mês por pessoa',
      features: ['Mobiliado', 'Internet', 'Cozinha equipada', '2 banheiros'],
      images: ['https://via.placeholder.com/300x200'],
    },
    {
      id: '3',
      type: 'room',
      title: 'Quarto em república estudantil',
      address: 'Rua dos Estudantes, 789',
      distance: '300m da universidade',
      price: 'R$ 450/mês',
      features: ['Mobiliado', 'Internet', 'Área comum', 'Lavanderia'],
      images: ['https://via.placeholder.com/300x200'],
    },
    {
      id: '4',
      type: 'apartment',
      title: 'Studio completo para estudantes',
      address: 'Rua das Acácias, 101',
      distance: '800m da universidade',
      price: 'R$ 900/mês',
      features: ['Mobiliado', 'Internet', 'Ar condicionado', 'Varanda'],
      images: ['https://via.placeholder.com/300x200'],
    },
  ];

  // Filtrar opções baseado na busca e na tab ativa
  const filteredOptions = housingOptions.filter(option => {
    const matchesSearch = 
      option.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === 'all') return matchesSearch;
    return option.type === activeTab && matchesSearch;
  });

  const renderHousingCard = (option: HousingOption) => (
    <Card key={option.id} style={styles.card}>
      <Image
        source={{ uri: option.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{option.title}</Text>
        <View style={styles.details}>
          <Ionicons name="location-outline" size={16} color={colors.text.tertiary} />
          <Text style={styles.address}>{option.address}</Text>
        </View>
        <View style={styles.details}>
          <Ionicons name="walk-outline" size={16} color={colors.text.tertiary} />
          <Text style={styles.distance}>{option.distance}</Text>
        </View>
        <View style={styles.features}>
          {option.features.map((feature, index) => (
            <View key={index} style={styles.featureBadge}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>{option.price}</Text>
          <Button
            title="Ver detalhes"
            variant="outline"
            size="small"
            onPress={() => {}}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Moradias" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar moradias..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
      </View>

      <View style={styles.tabs}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'rooms', label: 'Quartos' },
          { key: 'apartments', label: 'Apartamentos' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.key as 'all' | 'room' | 'apartment')}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filteredOptions.length > 0 ? (
          filteredOptions.map(renderHousingCard)
        ) : (
          <View style={styles.empty}>
            <Ionicons name="home-outline" size={48} color={colors.gray.medium} />
            <Text style={styles.emptyText}>Nenhuma moradia encontrada</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  searchContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray.light,
    borderRadius: 8,
    padding: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text.primary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray.medium,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.teal,
  },
  tabText: {
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.teal,
    fontWeight: 'bold',
  },
  list: {
    padding: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  address: {
    marginLeft: spacing.xs,
    color: colors.text.tertiary,
  },
  distance: {
    marginLeft: spacing.xs,
    color: colors.text.tertiary,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: spacing.sm,
  },
  featureBadge: {
    backgroundColor: colors.mint,
    borderRadius: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  featureText: {
    fontSize: typography.fontSize.xs,
    color: colors.darkGreen,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  price: {
    fontWeight: 'bold',
    color: colors.teal,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    marginTop: spacing.md,
    color: colors.text.tertiary,
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.teal,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default HousingScreen;
