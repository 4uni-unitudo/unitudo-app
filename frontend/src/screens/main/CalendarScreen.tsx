import React, { useState } from 'react';
import {
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LocaleConfig } from 'react-native-calendars';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';

// Configuração para português brasileiro
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
};

LocaleConfig.defaultLocale = 'pt-br';

// Define interfaces para eventos e estrutura de dados
interface Event {
  id: string;
  title: string;
  time: string;
  location: string;
  type: string;
  notes?: string;
}

interface EventsMap {
  [date: string]: Event[];
}

interface MarkedDates {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
}

interface EventFormData {
  id?: string;
  title: string;
  location: string;
  type: 'class' | 'study' | 'event';
  startDate: Date;
  endDate: Date;
  notes: string;
}

// Componente para visualização detalhada do evento
const EventDetailsModal = ({ 
  visible, 
  onClose, 
  event,
  onEdit,
  onDelete
}: { 
  visible: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}) => {
  if (!event) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'class': return 'book-outline';
      case 'event': return 'calendar-outline';
      case 'study': return 'people-outline';
      default: return 'calendar-outline';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'class': return colors.teal;
      case 'event': return colors.info;
      case 'study': return colors.warning;
      default: return colors.teal;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'class': return 'Aula';
      case 'event': return 'Evento';
      case 'study': return 'Estudo';
      default: return 'Evento';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir Evento",
      "Tem certeza que deseja excluir este evento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            onDelete(event);
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.detailsModalContainer}>
        <View style={styles.detailsModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.darkGreen} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailsContent}>
            <View style={[styles.eventTypeTag, { backgroundColor: getEventColor(event.type) }]}>
              <Ionicons name={getEventIcon(event.type)} size={16} color={colors.white} />
              <Text style={styles.eventTypeTagText}>{getEventTypeLabel(event.type)}</Text>
            </View>

            <Text style={styles.detailsTitle}>{event.title}</Text>
            
            <View style={styles.detailsRow}>
              <Ionicons name="time-outline" size={20} color={colors.text.tertiary} />
              <Text style={styles.detailsText}>{event.time}</Text>
            </View>
            
            <View style={styles.detailsRow}>
              <Ionicons name="location-outline" size={20} color={colors.text.tertiary} />
              <Text style={styles.detailsText}>{event.location}</Text>
            </View>
            
            {event.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Observações:</Text>
                <Text style={styles.notesText}>{event.notes}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.detailsButtonContainer}>
            <TouchableOpacity 
              style={[styles.detailsButton, styles.deleteButton]} 
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.detailsButton, styles.editButton]} 
              onPress={() => onEdit(event)}
            >
              <Ionicons name="create-outline" size={20} color={colors.white} />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const EventFormModal = ({ 
  visible, 
  onClose, 
  onSave, 
  initialData 
}: { 
  visible: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  initialData?: EventFormData;
}) => {
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      title: '',
      location: '',
      type: 'class',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hora depois
      notes: ''
    }
  );
  
  // Adicione este useEffect para atualizar o formulário quando initialData mudar
  React.useEffect(() => {
    // Atualizar o formData sempre que initialData mudar
    if (initialData) {
      setFormData(initialData);
    } else {
      // Resetar para valores padrão quando initialData for undefined
      setFormData({
        title: '',
        location: '',
        type: 'class',
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 60 * 60 * 1000),
        notes: ''
      });
    }
  }, [initialData]);
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {initialData?.id ? 'Editar Atividade' : 'Nova Atividade'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.darkGreen} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.formContainer}>
          <Text style={styles.inputLabel}>Título</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
            placeholder="Título da atividade"
          />
          
          <Text style={styles.inputLabel}>Local</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text) => setFormData({...formData, location: text})}
            placeholder="Local"
          />
          
          <Text style={styles.inputLabel}>Tipo</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[
                styles.typeOption, 
                formData.type === 'class' && styles.selectedTypeOption
              ]}
              onPress={() => setFormData({...formData, type: 'class'})}
            >
              <Ionicons name="book-outline" size={20} color={formData.type === 'class' ? colors.white : colors.teal} />
              <Text style={[
                styles.typeText,
                formData.type === 'class' && styles.selectedTypeText
              ]}>Aula</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.typeOption, 
                formData.type === 'study' && styles.selectedTypeOption
              ]}
              onPress={() => setFormData({...formData, type: 'study'})}
            >
              <Ionicons name="people-outline" size={20} color={formData.type === 'study' ? colors.white : colors.warning} />
              <Text style={[
                styles.typeText,
                formData.type === 'study' && styles.selectedTypeText
              ]}>Estudo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.typeOption, 
                formData.type === 'event' && styles.selectedTypeOption
              ]}
              onPress={() => setFormData({...formData, type: 'event'})}
            >
              <Ionicons name="calendar-outline" size={20} color={formData.type === 'event' ? colors.white : colors.info} />
              <Text style={[
                styles.typeText,
                formData.type === 'event' && styles.selectedTypeText
              ]}>Evento</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.inputLabel}>Data e Horário de Início</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.teal} />
              <Text style={styles.dateTimeText}>{formatDate(formData.startDate)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.timePickerButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color={colors.teal} />
              <Text style={styles.dateTimeText}>{formatTime(formData.startDate)}</Text>
            </TouchableOpacity>
          </View>
          
          {showStartDatePicker && (
            <DateTimePicker
              value={formData.startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  const newDate = new Date(selectedDate);
                  newDate.setHours(formData.startDate.getHours());
                  newDate.setMinutes(formData.startDate.getMinutes());
                  setFormData({...formData, startDate: newDate});
                }
              }}
            />
          )}
          
          {showStartTimePicker && (
            <DateTimePicker
              value={formData.startDate}
              mode="time"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartTimePicker(false);
                if (selectedDate) {
                  const newDate = new Date(formData.startDate);
                  newDate.setHours(selectedDate.getHours());
                  newDate.setMinutes(selectedDate.getMinutes());
                  setFormData({...formData, startDate: newDate});
                }
              }}
            />
          )}
          
          <Text style={styles.inputLabel}>Data e Horário de Término</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.teal} />
              <Text style={styles.dateTimeText}>{formatDate(formData.endDate)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.timePickerButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color={colors.teal} />
              <Text style={styles.dateTimeText}>{formatTime(formData.endDate)}</Text>
            </TouchableOpacity>
          </View>
          
          {showEndDatePicker && (
            <DateTimePicker
              value={formData.endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  const newDate = new Date(selectedDate);
                  newDate.setHours(formData.endDate.getHours());
                  newDate.setMinutes(formData.endDate.getMinutes());
                  setFormData({...formData, endDate: newDate});
                }
              }}
            />
          )}
          
          {showEndTimePicker && (
            <DateTimePicker
              value={formData.endDate}
              mode="time"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndTimePicker(false);
                if (selectedDate) {
                  const newDate = new Date(formData.endDate);
                  newDate.setHours(selectedDate.getHours());
                  newDate.setMinutes(selectedDate.getMinutes());
                  setFormData({...formData, endDate: newDate});
                }
              }}
            />
          )}
          
          <Text style={styles.inputLabel}>Observações</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData({...formData, notes: text})}
            placeholder="Observações adicionais"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ScrollView>
        
        <View style={styles.buttonContainer}>
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
      </View>
    </Modal>
  );
};

// Componente de seletor de dia
const DaySelector: React.FC<{
  selectedDate: Date;
  onChange: (date: Date) => void;
  onExpandCalendar: () => void;
}> = ({ selectedDate, onChange, onExpandCalendar }) => {
  // Função para navegar para o dia anterior
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    onChange(prevDay);
  };

  // Função para navegar para o próximo dia
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onChange(nextDay);
  };

  // Formatar o dia da semana
  const formatWeekday = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  };

  // Formatar o dia e mês
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  return (
    <View style={styles.daySelectorContainer}>
      <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}>
        <Ionicons name="chevron-back" size={24} color={colors.darkGreen} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.dateDisplay} onPress={onExpandCalendar}>
        <Text style={styles.weekdayText}>{formatWeekday(selectedDate)}</Text>
        <Text style={styles.dayText}>{formatDay(selectedDate)}</Text>
        <View style={styles.expandButton}>
          <Ionicons name="calendar" size={16} color={colors.teal} />
          <Text style={styles.expandText}>Expandir</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={goToNextDay} style={styles.arrowButton}>
        <Ionicons name="chevron-forward" size={24} color={colors.darkGreen} />
      </TouchableOpacity>
    </View>
  );
};

const CalendarScreen: React.FC = () => {
  // Estado para data selecionada (usando objeto Date para facilitar navegação)
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  
  // Estado para controlar se o calendário está expandido
  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(false);
  
  // Estado para controlar o modal de formulário
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  
  // Estado para controlar o modal de detalhes
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  
  // Estado para armazenar o evento selecionado
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Estado para armazenar o evento sendo editado
  const [eventToEdit, setEventToEdit] = useState<EventFormData | undefined>(undefined);
  
  // Estado para armazenar os eventos
  const [events, setEvents] = useState<EventsMap>({
    '2025-03-09': [
      {
        id: '1',
        title: 'Cálculo III',
        time: '08:00 - 10:00',
        location: 'Sala 201',
        type: 'class',
        notes: 'Trazer lista de exercícios resolvida',
      },
      {
        id: '2',
        title: 'Programação Web',
        time: '10:15 - 12:15',
        location: 'Laboratório 3',
        type: 'class',
        notes: 'Apresentação do projeto final',
      },
      {
        id: '3',
        title: 'Reunião Grupo de Estudos',
        time: '16:30 - 18:00',
        location: 'Biblioteca',
        type: 'study',
        notes: 'Revisão para prova de Cálculo',
      },
    ],
    '2025-03-10': [
      {
        id: '1',
        title: 'Estrutura de Dados',
        time: '08:00 - 10:00',
        location: 'Sala 105',
        type: 'class',
        notes: 'Implementação de árvores binárias',
      },
      {
        id: '2',
        title: 'Palestra: Machine Learning',
        time: '14:00 - 16:00',
        location: 'Auditório',
        type: 'event',
        notes: 'Palestrante: Prof. Dr. Silva',
      },
    ],
    '2025-03-11': [
      {
        id: '1',
        title: 'Banco de Dados',
        time: '10:15 - 12:15',
        location: 'Laboratório 2',
        type: 'class',
        notes: 'Entrega do trabalho final',
      },
    ],
  });
  
  // Converter Date para string no formato YYYY-MM-DD para uso com a biblioteca de calendário
  const selectedDate = selectedDateObj.toISOString().split('T')[0];

  // Formatar hora para exibição
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Preparar dados para o calendário
  const markedDates: MarkedDates = Object.keys(events).reduce((acc: MarkedDates, date) => {
    acc[date] = {
      marked: true,
      dotColor: colors.teal,
      selected: date === selectedDate,
      selectedColor: colors.mint,
    };
    return acc;
  }, {});

  // Adicionar o dia selecionado se não tiver eventos
  if (!markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.mint,
    };
  }

  const handleDayPress = (day: DateData) => {
    const date = new Date(day.timestamp);
    setSelectedDateObj(date);
    setIsCalendarExpanded(false); // Fechar o calendário após selecionar uma data
  };

  const toggleCalendarExpanded = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'class':
        return 'book-outline';
      case 'event':
        return 'calendar-outline';
      case 'study':
        return 'people-outline';
      default:
        return 'calendar-outline';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'class':
        return colors.teal;
      case 'event':
        return colors.info;
      case 'study':
        return colors.warning;
      default:
        return colors.teal;
    }
  };

  // Função para abrir a visualização de detalhes do evento
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Função para editar um evento existente
  const handleEditEvent = (event: Event) => {
    // Extrair horas de início e fim do formato "HH:MM - HH:MM"
    const [startTimeStr, endTimeStr] = event.time.split(' - ');
    
    // Criar objetos Date para horários de início e fim
    const startDate = new Date(selectedDateObj);
    const endDate = new Date(selectedDateObj);
    
    // Extrair horas e minutos
    const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
    const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
    
    // Configurar horas e minutos
    startDate.setHours(startHours, startMinutes);
    endDate.setHours(endHours, endMinutes);
    
    // Preparar dados para o formulário
    const formData: EventFormData = {
      id: event.id,
      title: event.title,
      location: event.location,
      type: event.type as 'class' | 'study' | 'event',
      startDate,
      endDate,
      notes: event.notes || '',
    };
    
    // Configurar o evento para edição, fechar detalhes e mostrar o formulário
    setEventToEdit(formData);
    setShowEventDetails(false);
    setShowEventForm(true);
  };

  // Função para deletar um evento
  const handleDeleteEvent = (event: Event) => {
    setEvents(prev => {
      const updatedEvents = {...prev};
      
      // Encontrar a data que contém o evento
      Object.keys(updatedEvents).forEach(date => {
        const eventIndex = updatedEvents[date].findIndex(e => e.id === event.id);
        if (eventIndex >= 0) {
          // Remover o evento da lista
          updatedEvents[date].splice(eventIndex, 1);
          
          // Se a lista de eventos ficar vazia, remover a data
          if (updatedEvents[date].length === 0) {
            delete updatedEvents[date];
          }
        }
      });
      
      return updatedEvents;
    });
  };

  // Função para salvar um evento (novo ou atualizado)
  const handleSaveEvent = (data: EventFormData) => {
    // Verificar se é uma atualização ou criação
    const isUpdate = !!data.id;
    
    // Gerar ID se for um novo evento
    const eventId = data.id || Math.random().toString(36).substring(2, 11);
    
    // Formatar a data para obter a chave do objeto events
    const formattedDate = data.startDate.toISOString().split('T')[0];
    
    // Criar evento no formato esperado
    const updatedEvent: Event = {
      id: eventId,
      title: data.title,
      time: `${formatTime(data.startDate)} - ${formatTime(data.endDate)}`,
      location: data.location,
      type: data.type,
      notes: data.notes,
    };
    
    setEvents(prev => {
      // Clonar o objeto de eventos anterior
      const updatedEvents = {...prev};
      
      // Se for uma atualização, primeiro remover o evento existente
      if (isUpdate) {
        // Procurar em todas as datas
        let found = false;
        Object.keys(updatedEvents).forEach(date => {
          const index = updatedEvents[date].findIndex(e => e.id === eventId);
          if (index >= 0) {
            updatedEvents[date].splice(index, 1);
            found = true;
            
            // Se a lista de eventos ficar vazia, remover a data
            if (updatedEvents[date].length === 0) {
              delete updatedEvents[date];
            }
          }
        });
        
        // Se não encontrou o evento para atualizar, algo está errado
        if (!found) {
          console.warn(`Evento com ID ${eventId} não encontrado para atualização`);
        }
      }
      
      // Adicionar evento na data selecionada/atualizada
      if (!updatedEvents[formattedDate]) {
        updatedEvents[formattedDate] = [];
      }
      updatedEvents[formattedDate].push(updatedEvent);
      
      return updatedEvents;
    });
    
    // Limpar os estados após salvar
    setEventToEdit(undefined);
  };

  const renderEvents = () => {
    // Pegar os eventos do dia selecionado
    const dayEvents = events[selectedDate] || [];
    
    if (dayEvents.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={colors.gray.medium} />
          <Text style={styles.emptyText}>Nenhum evento para este dia</Text>
        </View>
      );
    }
    
    return dayEvents.map((event: Event) => (
      <TouchableOpacity 
        key={event.id} 
        onPress={() => handleViewEvent(event)}
      >
        <Card style={styles.eventCard}>
          <View style={styles.eventTimeContainer}>
            <Text style={styles.eventTime}>{event.time}</Text>
          </View>
          <View style={styles.eventContent}>
            <View style={[styles.eventTypeIndicator, { backgroundColor: getEventColor(event.type) }]} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventLocation}>
                <Ionicons name="location-outline" size={14} color={colors.text.tertiary} />
                {' '}{event.location}
              </Text>
            </View>
            <View style={styles.eventIconContainer}>
              <Ionicons name={getEventIcon(event.type)} size={24} color={getEventColor(event.type)} />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Agenda" />
      
      {/* Seletor de dia ou calendário expandido */}
      {isCalendarExpanded ? (
        <View style={styles.calendarContainer}>
          <RNCalendar
            current={selectedDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={{
              calendarBackground: colors.white,
              textSectionTitleColor: colors.darkGreen,
              selectedDayBackgroundColor: colors.teal,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.teal,
              dayTextColor: colors.text.primary,
              textDisabledColor: colors.gray.medium,
              dotColor: colors.teal,
              selectedDotColor: colors.white,
              arrowColor: colors.teal,
              monthTextColor: colors.darkGreen,
              indicatorColor: colors.teal,
            }}
          />
          <TouchableOpacity 
            style={styles.collapseButton}
            onPress={toggleCalendarExpanded}
          >
            <Text style={styles.collapseButtonText}>Fechar Calendário</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <DaySelector 
          selectedDate={selectedDateObj}
          onChange={setSelectedDateObj}
          onExpandCalendar={toggleCalendarExpanded}
        />
      )}
      
      <View style={styles.eventsContainer}>
        <ScrollView
          contentContainerStyle={styles.eventsScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderEvents()}
        </ScrollView>
      </View>
      
      {/* Botão de adicionar evento */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          // Criar um objeto com os dados iniciais usando a data selecionada
          const newEventData: EventFormData = {
            title: '',
            location: '',
            type: 'class', // Agora TypeScript reconhece isso como o literal 'class'
            startDate: new Date(selectedDateObj),
            endDate: new Date(new Date(selectedDateObj).getTime() + 60 * 60 * 1000),
            notes: ''
          };
          setEventToEdit(newEventData);
          setShowEventForm(true);
        }}
      >
        <Ionicons name="add" size={24} color={colors.white} />
      </TouchableOpacity>
      
      {/* Modal de detalhes do evento */}
      <EventDetailsModal
        visible={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
      
      {/* Modal de formulário para criar/editar eventos */}
      <EventFormModal
        visible={showEventForm}
        onClose={() => setShowEventForm(false)}
        onSave={handleSaveEvent}
        initialData={eventToEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  calendarContainer: {
    backgroundColor: colors.white,
    paddingBottom: spacing.md,
  },
  collapseButton: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  collapseButtonText: {
    color: colors.teal,
    fontWeight: 'bold',
  },
  daySelectorContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    padding: spacing.sm,
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  weekdayText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  dayText: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginVertical: spacing.xs,
    textTransform: 'capitalize',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  expandText: {
    fontSize: typography.fontSize.xs,
    color: colors.teal,
    marginLeft: spacing.xs / 2,
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  eventsScrollContent: {
    paddingBottom: spacing.xl,
  },
  eventCard: {
    marginBottom: spacing.sm,
  },
  eventTimeContainer: {
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray.light,
    marginBottom: spacing.xs,
  },
  eventTime: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    fontWeight: 'bold',
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypeIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  eventLocation: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  eventIconContainer: {
    padding: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
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
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray.light,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.darkGreen,
  },
  formContainer: {
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
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray.medium,
  },
  selectedTypeOption: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  typeText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  selectedTypeText: {
    color: colors.white,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    marginRight: spacing.xs,
  },
  timePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    marginLeft: spacing.xs,
  },
  dateTimeText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray.light,
  },
  button: {
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray.light,
    marginRight: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.teal,
    marginLeft: spacing.sm,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  // Estilos para o modal de detalhes
  detailsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsModalContent: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  detailsContent: {
    padding: spacing.lg,
  },
  eventTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.teal,
    borderRadius: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  eventTypeTagText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: 'bold',
    marginLeft: spacing.xs / 2,
  },
  detailsTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailsText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  notesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray.light,
  },
  notesLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
  detailsButtonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray.light,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  deleteButton: {
    borderRightWidth: 1,
    borderRightColor: colors.gray.light,
  },
  editButton: {
    backgroundColor: colors.teal,
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
});

export default CalendarScreen;
