import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

interface Place {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  image: string;
  openHours: string;
}

const NearbyPlacesScreen: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Categorias de lugares
  const categories = [
    { id: 'all', name: 'Todos', icon: 'grid-outline' },
    { id: 'restaurant', name: 'Restaurantes', icon: 'restaurant-outline' },
    { id: 'cafe', name: 'Cafés', icon: 'cafe-outline' },
    { id: 'library', name: 'Livrarias', icon: 'book-outline' },
    { id: 'market', name: 'Mercados', icon: 'cart-outline' },
  ];
  
  // Função para simular a obtenção de dados
  useEffect(() => {
    // Aqui você conectaria com uma API real ou serviço de localização
    const fetchNearbyPlaces = async () => {
      // Simulando uma resposta de API
      setTimeout(() => {
        const mockPlaces: Place[] = [
          {
            id: '1',
            name: 'Restaurante Universitário',
            type: 'restaurant',
            distance: '150m',
            rating: 4.2,
            image: 'https://via.placeholder.com/150',
            openHours: '07:00 - 19:00',
          },
          {
            id: '2',
            name: 'Café do Centro',
            type: 'cafe',
            distance: '200m',
            rating: 4.5,
            image: 'https://via.placeholder.com/150',
            openHours: '08:00 - 20:00',
          },
          {
            id: '3',
            name: 'Livraria Acadêmica',
            type: 'library',
            distance: '350m',
            rating: 4.0,
            image: 'https://via.placeholder.com/150',
            openHours: '09:00 - 18:00',
          },
          {
            id: '4',
            name: 'Mercado Express',
            type: 'market',
            distance: '500m',
            rating: 3.8,
            image: 'https://via.placeholder.com/150',
            openHours: '08:00 - 22:00',
          },
          {
            id: '5',
            name: 'Pizzaria da Esquina',
            type: 'restaurant',
            distance: '600m',
            rating: 4.7,
            image: 'https://via.placeholder.com/150',
            openHours: '18:00 - 23:00',
          },
        ];
        
        setPlaces(mockPlaces);
        setLoading(false);
      }, 1500);
    };
    
    fetchNearbyPlaces();
  }, []);
  
  // Filtrar lugares com base na categoria selecionada
  const filteredPlaces = selectedCategory === 'all' 
    ? places 
    : places.filter(place => place.type === selectedCategory);
  
  // Renderizar estrelas de avaliação
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={`star-${i}`} name="star" size={16} color={colors.warning} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={`star-${i}`} name="star-half" size={16} color={colors.warning} />
        );
      } else {
        stars.push(
          <Ionicons key={`star-${i}`} name="star-outline" size={16} color={colors.warning} />
        );
      }
    }
    
    return (
      <View style={styles.ratingContainer}>
        {stars}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Lugares Próximos" />
      
      {/* Categorias */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Ionicons 
                name={item.icon as any} 
                size={20} 
                color={selectedCategory === item.id ? colors.white : colors.darkGreen} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.selectedCategoryText
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>
      
      {/* Lista de lugares */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.teal} />
          <Text style={styles.loadingText}>Carregando estabelecimentos...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlaces}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card style={styles.placeCard}>
              <View style={styles.placeContent}>
                <Image source={{ uri: item.image }} style={styles.placeImage} />
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>{item.name}</Text>
                  <View style={styles.placeDetailsRow}>
                    <Ionicons name="location-outline" size={16} color={colors.text.tertiary} />
                    <Text style={styles.placeDetailsText}>{item.distance}</Text>
                  </View>
                  <View style={styles.placeDetailsRow}>
                    <Ionicons name="time-outline" size={16} color={colors.text.tertiary} />
                    <Text style={styles.placeDetailsText}>{item.openHours}</Text>
                  </View>
                  {renderRatingStars(item.rating)}
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.placesListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={48} color={colors.gray.medium} />
              <Text style={styles.emptyText}>Nenhum estabelecimento encontrado</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
  },
  categoryList: {
    paddingHorizontal: spacing.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  selectedCategoryButton: {
    backgroundColor: colors.teal,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.darkGreen,
    marginLeft: spacing.xs,
  },
  selectedCategoryText: {
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
  },
  placesListContent: {
    padding: spacing.lg,
  },
  placeCard: {
    marginBottom: spacing.md,
  },
  placeContent: {
    flexDirection: 'row',
  },
  placeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  placeName: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  placeDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs / 2,
  },
  placeDetailsText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginLeft: spacing.xs / 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
});

export default NearbyPlacesScreen;
