import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signUpStyles as styles } from '../styles/signUp.styles';
import { MONTHS, DAYS } from '../constants/months';

type BirthdayStepProps = {
  birthdayTitleOpacity: Animated.Value;
  birthdayTitleScale: Animated.Value;
  birthdayTitleTranslateY: Animated.Value;
  birthdaySubtitleOpacity: Animated.Value;
  birthdaySubtitleTranslateY: Animated.Value;
  birthdayInputOpacity: Animated.Value;
  birthdayInputTranslateY: Animated.Value;
  birthdayButtonOpacity: Animated.Value;
  birthdayButtonTranslateY: Animated.Value;
  selectedMonth: string;
  selectedDay: string;
  showMonthModal: boolean;
  showDayModal: boolean;
  setShowMonthModal: (show: boolean) => void;
  setShowDayModal: (show: boolean) => void;
  setSelectedMonth: (month: string) => void;
  setSelectedDay: (day: string) => void;
  onContinue: () => void;
  onModalOverlayPress: (modalType: 'month' | 'day') => void;
};

export function BirthdayStep({
  birthdayTitleOpacity,
  birthdayTitleScale,
  birthdayTitleTranslateY,
  birthdaySubtitleOpacity,
  birthdaySubtitleTranslateY,
  birthdayInputOpacity,
  birthdayInputTranslateY,
  birthdayButtonOpacity,
  birthdayButtonTranslateY,
  selectedMonth,
  selectedDay,
  showMonthModal,
  showDayModal,
  setShowMonthModal,
  setShowDayModal,
  setSelectedMonth,
  setSelectedDay,
  onContinue,
  onModalOverlayPress,
}: BirthdayStepProps) {
  return (
    <>
      <Animated.View 
        style={[
          styles.titleContainer,
          {
            opacity: birthdayTitleOpacity,
            transform: [
              { translateY: birthdayTitleTranslateY },
              { scale: birthdayTitleScale }
            ]
          }
        ]}
      >
        <Text style={styles.birthdayQuestion}>When's your birthday?</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.subtitleContainer,
          {
            opacity: birthdaySubtitleOpacity,
            transform: [{ translateY: birthdaySubtitleTranslateY }]
          }
        ]}
      >
        <Text style={styles.subtitle}>
          We'll use this to personalize your reading experience.
        </Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.formContainer,
          {
            opacity: birthdayInputOpacity,
            transform: [{ translateY: birthdayInputTranslateY }]
          }
        ]}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={[styles.dropdownButton, styles.halfInput]}
            onPress={() => setShowMonthModal(true)}
          >
            <Text style={[styles.dropdownText, !selectedMonth && styles.placeholderText]}>
              {selectedMonth || 'Month'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#7a7f85" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.dropdownButton, styles.halfInput]}
            onPress={() => setShowDayModal(true)}
          >
            <Text style={[styles.dropdownText, !selectedDay && styles.placeholderText]}>
              {selectedDay || 'Day'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#7a7f85" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: birthdayButtonOpacity,
            transform: [{ translateY: birthdayButtonTranslateY }]
          }
        ]}
      >
        <TouchableOpacity 
          activeOpacity={0.95} 
          style={styles.button}
          onPress={onContinue}
        >
          <LinearGradient
            colors={["#4A90E2", "#7B68EE"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Month Selection Modal */}
      <Modal
        visible={showMonthModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => onModalOverlayPress('month')}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Month</Text>
                <ScrollView 
                  style={styles.modalScrollView}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {MONTHS.map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.modalOption,
                        selectedMonth === month && styles.selectedOption
                      ]}
                      onPress={() => {
                        setSelectedMonth(month);
                        setShowMonthModal(false);
                      }}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        selectedMonth === month && styles.selectedOptionText
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowMonthModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Day Selection Modal */}
      <Modal
        visible={showDayModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDayModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => onModalOverlayPress('day')}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Day</Text>
                <ScrollView 
                  style={styles.modalScrollView}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {DAYS.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.modalOption,
                        selectedDay === day && styles.selectedOption
                      ]}
                      onPress={() => {
                        setSelectedDay(day);
                        setShowDayModal(false);
                      }}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        selectedDay === day && styles.selectedOptionText
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowDayModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
