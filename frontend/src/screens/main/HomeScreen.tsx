import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Card from '../../components/common/Card';

// Interface para os trabalhos pendentes
interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  completed: boolean;
}

const HomeScreen: React.FC = () => {
  // Obter data atual formatada
  const formattedDate = useMemo(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('pt-BR', options);
  }, []);
  
  // Estado para os trabalhos pendentes
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Relatório de Física',
      subject: 'Física III',
      dueDate: new Date(2025, 2, 10, 23, 59), // 10/03/2025 23:59
      completed: false,
    },
    {
      id: '2',
      title: 'Projeto de Banco de Dados',
      subject: 'Banco de Dados I',
      dueDate: new Date(2025, 2, 11, 18, 0), // 11/03/2025 18:00
      completed: false,
    },
    {
      id: '3',
      title: 'Lista de Exercícios',
      subject: 'Cálculo III',
      dueDate: new Date(2025, 2, 12, 12, 0), // 12/03/2025 12:00
      completed: true,
    },
  ]);

  // Função para formatar data e hora
  const formatDeadline = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  
  // Função para alternar o estado completo de um trabalho
  const toggleAssignmentCompletion = (id: string) => {
    setAssignments(prevAssignments =>
      prevAssignments.map(assignment =>
        assignment.id === id
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      )
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Olá, João!</Text>
            <Text style={styles.university}>FIAP</Text>
            
            {/* Data movida para o header */}
            <View style={styles.dateContainer}>
              <Ionicons name="today-outline" size={16} color={colors.text.tertiary} />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>J</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trabalhos pendentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas Entregas</Text>
          
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <Card key={assignment.id} style={styles.assignmentCard}>
                <View style={styles.assignmentContent}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => toggleAssignmentCompletion(assignment.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      assignment.completed && styles.checkboxCompleted
                    ]}>
                      {assignment.completed && (
                        <Ionicons name="checkmark" size={16} color={colors.white} />
                      )}
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.assignmentDetails}>
                    <Text style={[
                      styles.assignmentTitle,
                      assignment.completed && styles.assignmentTitleCompleted
                    ]}>
                      {assignment.title}
                    </Text>
                    <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
                    <View style={styles.dueDateContainer}>
                      <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
                      <Text style={styles.dueDate}>{formatDeadline(assignment.dueDate)}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum trabalho pendente</Text>
            </View>
          )}
        </View>
        
        {/* Próximas aulas do dia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aulas de Hoje</Text>
          
          <Card style={styles.classCard}>
            <View style={styles.classInfo}>
              <View style={styles.classTimeContainer}>
                <Text style={styles.classTime}>08:00 - 10:00</Text>
              </View>
              <View style={styles.classDetails}>
                <Text style={styles.classSubject}>Cálculo III</Text>
                <Text style={styles.classLocation}>
                  <Ionicons name="location-outline" size={14} color={colors.text.tertiary} />
                  {' '}Sala 201
                </Text>
              </View>
            </View>
          </Card>
          
          <Card style={styles.classCard}>
            <View style={styles.classInfo}>
              <View style={styles.classTimeContainer}>
                <Text style={styles.classTime}>10:15 - 12:15</Text>
              </View>
              <View style={styles.classDetails}>
                <Text style={styles.classSubject}>Programação Web</Text>
                <Text style={styles.classLocation}>
                  <Ionicons name="location-outline" size={14} color={colors.text.tertiary} />
                  {' '}Laboratório 3
                </Text>
              </View>
            </View>
          </Card>
          
          <Card style={styles.classCard}>
            <View style={styles.classInfo}>
              <View style={styles.classTimeContainer}>
                <Text style={styles.classTime}>14:00 - 16:00</Text>
              </View>
              <View style={styles.classDetails}>
                <Text style={styles.classSubject}>Banco de Dados</Text>
                <Text style={styles.classLocation}>
                  <Ionicons name="location-outline" size={14} color={colors.text.tertiary} />
                  {' '}Sala 105
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'ios' ? 60 : 35, // Aumentado
    paddingBottom: spacing.lg, // Aumentado
    paddingHorizontal: spacing.lg,
    minHeight: Platform.OS === 'ios' ? 140 : 120, // Adicionado altura mínima
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Centralizar verticalmente
  },
  userInfo: {
    flex: 1,
    paddingRight: spacing.md, // Espaço para não colidir com a imagem maior
  },
  greeting: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.darkGreen,
  },
  university: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dateText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  profileButton: {
    height: 60, // Aumentado de 40 para 60
    width: 60,  // Aumentado de 40 para 60
    borderRadius: 30, // Correspondente ao novo tamanho
    overflow: 'hidden',
  },
  profileImage: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: typography.fontSize.xxl, // Aumentado
    fontWeight: 'bold',
    color: colors.white,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginBottom: spacing.md,
  },
  assignmentCard: {
    marginBottom: spacing.sm,
  },
  assignmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: spacing.md,
    padding: spacing.xs, // Área maior para toque
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.teal,
  },
  assignmentDetails: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  assignmentTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.text.tertiary,
  },
  assignmentSubject: {
    fontSize: typography.fontSize.sm,
    color: colors.teal,
    marginBottom: spacing.xs,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    marginLeft: spacing.xs / 2,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
  },
  classCard: {
    marginBottom: spacing.sm,
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classTimeContainer: {
    backgroundColor: colors.mint,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  classTime: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
    color: colors.darkGreen,
  },
  classDetails: {
    flex: 1,
  },
  classSubject: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  classLocation: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
});

export default HomeScreen;
