import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';

// Interfaces para os tipos de caronas
interface AvailableRide {
  id: string;
  driver: string;
  driverId: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  departureDate: Date; // Adicionado para uso com DateTimePicker
  availableSeats: number;
  price: string;
  numericPrice: number;
  verified: boolean; // Substituído rating por verified
  description?: string;
  driverPhoto?: string;
  contactInfo: string;
  status: 'active' | 'completed' | 'canceled';
  // Campos adicionais para o perfil
  faculty?: string;
  course?: string;
  memberSince?: string;
}

interface OfferingRide {
  id: string;
  type: 'offering';
  origin: string;
  destination: string;
  date: string;
  time: string;
  departureDate: Date; // Para uso com DateTimePicker
  availableSeats: number;
  price: string;
  numericPrice: number;
  description?: string;
  contactInfo: string;
  status: 'active' | 'completed' | 'canceled';
}

type MyRide = OfferingRide;

// Modal de detalhes da carona
const RideDetailsModal = ({ 
  visible, 
  onClose, 
  ride,
  onContactDriver,
  onEditRide,
  isUserCreator
}: { 
  visible: boolean;
  onClose: () => void;
  ride: AvailableRide | null;
  onContactDriver: (contact: string) => void;
  onEditRide?: (rideId: string) => void;
  isUserCreator: boolean;
}) => {
  if (!ride) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes da Carona</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.darkGreen} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Status da carona */}
            <View style={[
              styles.statusBadge, 
              ride.status === 'active' ? styles.statusActive : 
              ride.status === 'completed' ? styles.statusCompleted : 
              styles.statusCanceled
            ]}>
              <Text style={styles.statusText}>
                {ride.status === 'active' ? 'Ativa' : 
                 ride.status === 'completed' ? 'Finalizada' : 
                 'Cancelada'}
              </Text>
            </View>

            {/* Informações do trajeto */}
            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <View style={[styles.routeMarker, styles.originMarker]} />
                <Text style={styles.routeText}>{ride.origin}</Text>
              </View>
              
              <View style={styles.routeLine} />
              
              <View style={styles.routePoint}>
                <View style={[styles.routeMarker, styles.destinationMarker]} />
                <Text style={styles.routeText}>{ride.destination}</Text>
              </View>
            </View>

            {/* Data e hora */}
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color={colors.teal} />
              <Text style={styles.detailText}>
                {ride.date} às {ride.time}
              </Text>
            </View>

            <View style={styles.driverContainer}>
              {ride.driverPhoto ? (
                <Image 
                  source={{ uri: ride.driverPhoto }} 
                  style={styles.driverPhoto} 
                />
              ) : (
                <View style={styles.driverPhotoPlaceholder}>
                  <Text style={styles.driverInitial}>{ride.driver.charAt(0)}</Text>
                </View>
              )}
              
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{ride.driver}</Text>
                <View style={styles.verificationContainer}>
                  <Ionicons 
                    name={ride.verified ? "shield-checkmark" : "alert-circle"} 
                    size={16} 
                    color={ride.verified ? colors.success : colors.warning} 
                  />
                  <Text style={[
                    styles.verificationText,
                    { color: ride.verified ? colors.success : colors.warning }
                  ]}>
                    {ride.verified ? "Usuário verificado" : "Usuário não verificado"}
                  </Text>
                </View>
              </View>
            </View>
            {/* Detalhes adicionais */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={20} color={colors.teal} />
                <Text style={styles.detailText}>
                  {ride.availableSeats} {ride.availableSeats === 1 ? 'vaga disponível' : 'vagas disponíveis'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={20} color={colors.teal} />
                <Text style={styles.detailText}>
                  {ride.price}
                </Text>
              </View>
            </View>

            {/* Descrição */}
            {ride.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Observações:</Text>
                <Text style={styles.descriptionText}>{ride.description}</Text>
              </View>
            )}

            {/* Informações de contato */}
            <View style={styles.contactInfoContainer}>
              <Text style={styles.contactInfoLabel}>Contato:</Text>
              <Text style={styles.contactInfoText}>{ride.contactInfo}</Text>
            </View>
          </ScrollView>

          {/* Botões de ação */}
          <View style={styles.actionsContainer}>
            {isUserCreator ? (
              // Apenas botão de editar para o criador
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => onEditRide && onEditRide(ride.id)}
              >
                <Ionicons name="create-outline" size={20} color={colors.white} />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            ) : (
              // Apenas botão de contato para outros usuários
              <TouchableOpacity 
                style={[styles.actionButton, styles.contactButton]}
                onPress={() => onContactDriver(ride.contactInfo)}
              >
                <Ionicons name="chatbubble-outline" size={20} color={colors.white} />
                <Text style={styles.contactButtonText}>Contatar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Modal para criar uma nova carona
const CreateRideModal = ({
  visible,
  onClose,
  onSave,
  initialData
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (rideData: Omit<OfferingRide, 'id'>) => void;
  initialData?: OfferingRide;
}) => {
  const initialDate = new Date();
  initialDate.setMinutes(Math.ceil(initialDate.getMinutes() / 15) * 15);
  
  const [rideData, setRideData] = useState<Omit<OfferingRide, 'id'>>(
    initialData || {
      type: 'offering',
      origin: '',
      destination: '',
      date: '',
      time: '',
      departureDate: initialDate,
      availableSeats: 1,
      price: 'R$ 0,00',
      numericPrice: 0,
      description: '',
      contactInfo: '',
      status: 'active'
    }
  );
  
  // Estados para controlar os seletores de data/hora
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Atualizar o estado quando initialData mudar
  React.useEffect(() => {
    if (initialData) {
      setRideData({
        type: initialData.type,
        origin: initialData.origin,
        destination: initialData.destination,
        date: initialData.date,
        time: initialData.time,
        departureDate: initialData.departureDate,
        availableSeats: initialData.availableSeats,
        price: initialData.price,
        numericPrice: initialData.numericPrice,
        description: initialData.description || '',
        contactInfo: initialData.contactInfo,
        status: initialData.status
      });
    }
  }, [initialData]);

  // Função para formatar data 
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Função para formatar hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Atualizar data e hora quando mudam nos seletores
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      // Manter a hora atual, só alterar a data
      newDate.setHours(rideData.departureDate.getHours());
      newDate.setMinutes(rideData.departureDate.getMinutes());
      
      setRideData({
        ...rideData, 
        departureDate: newDate,
        date: formatDate(newDate)
      });
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(rideData.departureDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      
      setRideData({
        ...rideData, 
        departureDate: newDate,
        time: formatTime(newDate)
      });
    }
  };

  const handleSave = () => {
    // Validação básica
    if (!rideData.origin || !rideData.destination || !rideData.date || !rideData.time) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validação de contato
    if (!rideData.contactInfo) {
      Alert.alert("Informações de contato", "Por favor, informe um contato para os interessados.");
      return;
    }

    onSave(rideData);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <KeyboardAvoidingView 
        style={styles.createRideContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {initialData ? 'Editar Carona' : 'Oferecer Carona'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.darkGreen} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.createRideContent}>
          <Text style={styles.inputLabel}>Origem</Text>
          <TextInput
            style={styles.input}
            value={rideData.origin}
            onChangeText={(text) => setRideData({...rideData, origin: text})}
            placeholder="Local de partida"
          />

          <Text style={styles.inputLabel}>Destino</Text>
          <TextInput
            style={styles.input}
            value={rideData.destination}
            onChangeText={(text) => setRideData({...rideData, destination: text})}
            placeholder="Local de chegada"
          />

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Data</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.teal} />
                <Text style={styles.dateTimeText}>
                  {rideData.date || formatDate(rideData.departureDate)}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={rideData.departureDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Hora</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={colors.teal} />
                <Text style={styles.dateTimeText}>
                  {rideData.time || formatTime(rideData.departureDate)}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={rideData.departureDate}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                  minuteInterval={5}
                />
              )}
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Vagas</Text>
              <TextInput
                style={styles.input}
                value={rideData.availableSeats.toString()}
                onChangeText={(text) => {
                  const seats = parseInt(text) || 0;
                  setRideData({...rideData, availableSeats: seats});
                }}
                keyboardType="numeric"
                placeholder="Número de vagas"
              />
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Preço</Text>
              <TextInput
                style={styles.input}
                value={rideData.price}
                onChangeText={(text) => {
                  // Extrair apenas números para numericPrice
                  const numericValue = parseFloat(text.replace(/[^\d]/g, '')) / 100 || 0;
                  setRideData({
                    ...rideData, 
                    price: text,
                    numericPrice: numericValue
                  });
                }}
                placeholder="R$ 0,00"
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Informações de Contato</Text>
          <TextInput
            style={styles.input}
            value={rideData.contactInfo}
            onChangeText={(text) => setRideData({...rideData, contactInfo: text})}
            placeholder="WhatsApp, telefone, etc."
          />

          <Text style={styles.inputLabel}>Observações (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={rideData.description}
            onChangeText={(text) => setRideData({...rideData, description: text})}
            placeholder="Informações adicionais, ponto de encontro, etc."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ScrollView>

        <View style={styles.createRideActions}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const RidesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');
  const [selectedRide, setSelectedRide] = useState<AvailableRide | null>(null);
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [rideToEdit, setRideToEdit] = useState<OfferingRide | undefined>(undefined);
  
  // Estado para controlar o usuário (para simular a verificação de motorista/passageiro)
  const [userId] = useState('user123');

  // Dados simulados para exibição
  const availableRides: AvailableRide[] = [
    {
      id: '1',
      driver: 'Carlos Silva',
      driverId: 'driver1',
      origin: 'Centro',
      destination: 'Universidade',
      date: '10 de março',
      time: '07:30',
      departureDate: new Date(2025, 2, 10, 7, 30),
      availableSeats: 3,
      price: 'R$ 5,00',
      numericPrice: 5.00,
      verified: true,
      description: 'Saio do Centro, próximo à Praça XV. Posso esperar até 5 minutos.',
      contactInfo: '(47) 99999-9999',
      status: 'active',
      faculty: 'Engenharia',
      course: 'Engenharia de Software',
      memberSince: 'Março de 2023'
    },
    {
      id: '2',
      driver: 'Ana Oliveira',
      driverId: 'driver2',
      origin: 'Zona Sul',
      destination: 'Universidade',
      date: '10 de março',
      time: '08:00',
      departureDate: new Date(2025, 2, 10, 8, 0),
      availableSeats: 2,
      price: 'R$ 6,00',
      numericPrice: 6.00,
      verified: false,
      description: 'Saio do Shopping da Zona Sul, no estacionamento principal.',
      contactInfo: 'ana.whatsapp',
      status: 'active',
      faculty: 'Ciências da Computação',
      course: 'Ciência de Dados',
    },
    {
      id: '3',
      driver: 'Pedro Santos',
      driverId: 'driver3',
      origin: 'Universidade',
      destination: 'Centro',
      date: '10 de março',
      time: '18:00',
      departureDate: new Date(2025, 2, 10, 18, 0),
      availableSeats: 4,
      price: 'R$ 5,00',
      numericPrice: 5.00,
      verified: true,
      contactInfo: 'pedro@email.com',
      status: 'active',
    },
  ];

  const myRides: MyRide[] = [
    {
      id: '1',
      type: 'offering',
      origin: 'Zona Norte',
      destination: 'Universidade',
      date: '11 de março',
      time: '07:45',
      departureDate: new Date(2025, 2, 11, 7, 45),
      availableSeats: 3,
      price: 'R$ 5,00',
      numericPrice: 5.00,
      description: 'Saio pontualmente. Local de encontro: em frente ao Mercado Municipal.',
      contactInfo: '(47) 98888-8888',
      status: 'active',
    }
  ];

  // Apenas filtrar caronas que o usuário está oferecendo na aba "Minhas Caronas"
  const filteredRides = activeTab === 'available'
    ? availableRides.filter(ride => 
        ride.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.driver.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : myRides;

  // Manipuladores para ações nos detalhes da carona
  const handleContactDriver = (contactInfo: string) => {
    Alert.alert(
      "Informações de Contato",
      `Entre em contato diretamente: ${contactInfo}`,
      [{ text: "Entendi" }]
    );
  };

  const handleEditRide = (rideId: string) => {
    const rideToEdit = myRides.find(r => r.id === rideId);
    if (rideToEdit) {
      setRideToEdit(rideToEdit);
      setShowRideDetails(false);
      setShowCreateRide(true);
    }
  };

  // Verificar se o usuário é o criador da carona selecionada
  const isUserCreator = selectedRide ? 
    myRides.some(r => r.id === selectedRide.id) : 
    false;

  // Abrir o modal de detalhes para uma carona
  const openRideDetails = (ride: AvailableRide) => {
    setSelectedRide(ride);
    setShowRideDetails(true);
  };

  // Salvar uma nova carona ou editar uma existente
  const handleSaveRide = (rideData: Omit<OfferingRide, 'id'>) => {
    if (rideToEdit) {
      // Lógica para atualizar uma carona existente
      // Aqui você faria a chamada ao backend
      Alert.alert(
        "Carona Atualizada",
        "Sua carona foi atualizada com sucesso!",
        [{ text: "OK" }]
      );
    } else {
      // Lógica para criar uma nova carona
      // Aqui você faria a chamada ao backend
      Alert.alert(
        "Carona Criada",
        "Sua carona foi criada com sucesso!",
        [{ text: "OK" }]
      );
    }
    
    setRideToEdit(undefined);
    setShowCreateRide(false);
  };

  const renderAvailableRides = () => {
    if (filteredRides.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={48} color={colors.gray.medium} />
          <Text style={styles.emptyText}>Nenhuma carona disponível</Text>
        </View>
      );
    }

    return filteredRides.map((ride) => (
      <Card 
        key={ride.id} 
        style={styles.rideCard} 
        onPress={() => openRideDetails(ride as AvailableRide)}
      >
        <View style={styles.rideHeader}>
          <View style={styles.driverInfo}>
          <View style={styles.driverAvatar}>
            {'driver' in ride && (
              <Text style={styles.driverInitial}>{ride.driver.charAt(0)}</Text>
            )}
          </View>
            <View>
              {'driver' in ride && (
                <Text style={styles.driverName}>{ride.driver}</Text>
              )}
              <View style={styles.verificationContainer}>
                <Ionicons 
                  name={'verified' in ride && ride.verified ? "shield-checkmark" : "alert-circle"} 
                  size={14} 
                  color={'verified' in ride && ride.verified ? colors.success : colors.warning} 
                />
                <Text style={[
                  styles.verificationTextSmall,
                  { color: 'verified' in ride && ride.verified ? colors.success : colors.warning }
                ]}>
                  {'verified' in ride && ride.verified ? "Verificado" : "Não verificado"}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.priceText}>{ride.price}</Text>
        </View>
        
        <View style={styles.rideDetails}>
          <View style={styles.routeContainer}>
            <View style={styles.routeIcons}>
              <View style={styles.originDot} />
              <View style={styles.routeLine} />
              <View style={styles.destinationDot} />
            </View>
            <View style={styles.routeTexts}>
              <Text style={styles.routeText}>{ride.origin}</Text>
              <Text style={styles.routeText}>{ride.destination}</Text>
            </View>
          </View>
          
          <View style={styles.rideInfo}>
            <Text style={styles.rideInfoText}>
              <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
              {' '}{ride.date}
            </Text>
            <Text style={styles.rideInfoText}>
              <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
              {' '}{ride.time}
            </Text>
            <Text style={styles.rideInfoText}>
              <Ionicons name="people-outline" size={14} color={colors.text.tertiary} />
              {' '}{ride.availableSeats} vagas
            </Text>
          </View>
        </View>
      </Card>
    ));
  };

  const renderMyRides = () => {
    if (filteredRides.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={48} color={colors.gray.medium} />
          <Text style={styles.emptyText}>Você não oferece caronas</Text>
        </View>
      );
    }

    return filteredRides.map((ride) => {
      // Converter MyRide para AvailableRide para o modal
      const convertedRide: AvailableRide = {
        id: ride.id,
        driver: 'Você',
        driverId: userId,
        origin: ride.origin,
        destination: ride.destination,
        date: ride.date,
        time: ride.time,
        departureDate: ride.departureDate,
        availableSeats: ride.availableSeats,
        price: ride.price,
        numericPrice: ride.numericPrice,
        verified: true, // O próprio usuário é sempre verificado para si mesmo
        description: ride.description,
        contactInfo: ride.contactInfo,
        status: ride.status,
      };

      return (
        <Card 
          key={ride.id} 
          style={styles.rideCard} 
          onPress={() => {
            setSelectedRide(convertedRide);
            setShowRideDetails(true);
          }}
        >
          <View style={styles.rideHeader}>
            <View style={styles.myRideTypeContainer}>
              <Text style={styles.myRideTypeText}>Oferecendo</Text>
            </View>
            <Text style={styles.priceText}>{ride.price}</Text>
          </View>
          
          <View style={styles.rideDetails}>
            <View style={styles.routeContainer}>
              <View style={styles.routeIcons}>
                <View style={styles.originDot} />
                <View style={styles.routeLine} />
                <View style={styles.destinationDot} />
              </View>
              <View style={styles.routeTexts}>
                <Text style={styles.routeText}>{ride.origin}</Text>
                <Text style={styles.routeText}>{ride.destination}</Text>
              </View>
            </View>
            
            <View style={styles.rideInfo}>
              <Text style={styles.rideInfoText}>
                <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
                {' '}{ride.date}
              </Text>
              <Text style={styles.rideInfoText}>
                <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
                {' '}{ride.time}
              </Text>
              <Text style={styles.rideInfoText}>
                <Ionicons name="people-outline" size={14} color={colors.text.tertiary} />
                {' '}{ride.availableSeats} vagas
              </Text>
            </View>
          </View>
        </Card>
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Caronas" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar caronas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'available' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('available')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'available' && styles.activeTabText,
            ]}
          >
            Disponíveis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'my' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('my')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'my' && styles.activeTabText,
            ]}
          >
            Minhas Caronas
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.ridesContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'available' ? renderAvailableRides() : renderMyRides()}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          setRideToEdit(undefined);
          setShowCreateRide(true);
        }}
      >
        <Ionicons name="add" size={24} color={colors.white} />
      </TouchableOpacity>
      
      {/* Modal de detalhes da carona */}
      <RideDetailsModal
        visible={showRideDetails}
        onClose={() => setShowRideDetails(false)}
        ride={selectedRide}
        onContactDriver={handleContactDriver}
        onEditRide={handleEditRide}
        isUserCreator={isUserCreator}
      />
      
      {/* Modal de criação de carona */}
      <CreateRideModal
        visible={showCreateRide}
        onClose={() => {
          setShowCreateRide(false);
          setRideToEdit(undefined);
        }}
        onSave={handleSaveRide}
        initialData={rideToEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray.light,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray.medium,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.teal,
  },
  tabText: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.tertiary,
  },
  activeTabText: {
    color: colors.teal,
  },
  ridesContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  rideCard: {
    marginBottom: spacing.md,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.lg,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  driverInitial: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.darkGreen,
  },
  driverName: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  verificationText: {
    fontSize: typography.fontSize.sm,
    marginLeft: spacing.xs,
  },
  verificationTextSmall: {
    fontSize: typography.fontSize.xs,
    marginLeft: spacing.xs / 2,
  },
  priceText: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.teal,
  },
  myRideTypeContainer: {
    backgroundColor: colors.mint,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 4,
  },
  myRideTypeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: 'bold',
    color: colors.darkGreen,
  },
  rideDetails: {
    marginTop: spacing.sm,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  routeIcons: {
    width: 24,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.teal,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.gray.medium,
    marginVertical: 4,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.darkGreen,
  },
  routeTexts: {
    flex: 1,
    justifyContent: 'space-between',
    height: 50,
  },
  routeText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  rideInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  rideInfoText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  // Estilos para o modal de detalhes
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray.light,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.darkGreen,
  },
  modalContent: {
    padding: spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  statusActive: {
    backgroundColor: colors.success + '20',
  },
  statusCompleted: {
    backgroundColor: colors.info + '20',
  },
  statusCanceled: {
    backgroundColor: colors.error + '20',
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  routeMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  originMarker: {
    backgroundColor: colors.teal,
  },
  destinationMarker: {
    backgroundColor: colors.info,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.md,
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverPhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.mint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverDetailsText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  detailsSection: {
    marginBottom: spacing.md,
  },
  descriptionContainer: {
    marginBottom: spacing.md,
  },
  descriptionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
  contactInfoContainer: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  contactInfoLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  contactInfoText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray.light,
    padding: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginHorizontal: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.teal,
  },
  contactButton: {
    backgroundColor: colors.info,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.error,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  contactButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  cancelButtonText: {
    color: colors.error,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  // Estilos para o modal de criação de carona
  createRideContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  createRideContent: {
    flex: 1,
    padding: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dateTimeText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  createRideActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray.light,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
  },
  saveButton: {
    backgroundColor: colors.teal,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  }
});

export default RidesScreen;
