import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { getNextDays, formatDayName, formatDayNumber, formatMonthYear, formatDateDisplay } from '../utils/dateUtils';
import { TIME_PERIODS, PERIOD_CONFIG, generateTimeSlots, getSlotCount } from '../constants/timeSlots';
import { useBookings } from '../context/BookingContext';

const { width } = Dimensions.get('window');

const BookingScreen = ({ route, navigation }) => {
  const { turfData } = route.params;
  const { addBooking } = useBookings();

  const dates = getNextDays(10);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(TIME_PERIODS.NOON);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState('Court B');
  const [playerCount, setPlayerCount] = useState(5);
  const [duration, setDuration] = useState(1); // Duration in hours

  const timeSlots = selectedPeriod ? generateTimeSlots(selectedPeriod) : [];
  const isValid = selectedDate && selectedSlot && selectedCourt && playerCount >= 1;

  const totalPrice = turfData.pricePerHour * duration;

  const handleNext = () => {
    if (!isValid) return;

    const booking = {
      turfId: turfData.id,
      turfName: turfData.name,
      date: formatDateDisplay(selectedDate),
      dateISO: selectedDate.toISOString(),
      period: selectedPeriod,
      slot: selectedSlot,
      court: selectedCourt,
      playerCount,
      duration,
      pricePerHour: turfData.pricePerHour,
      totalPrice: totalPrice,
      pricePerPlayer: Math.round(totalPrice / playerCount),
    };

    addBooking(booking);
    navigation.navigate('MyBookings');
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: turfData.name,
      headerShown: true,
    });
  }, [navigation, turfData.name]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Date Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.monthRow}>
            <Text style={styles.monthText}>{formatMonthYear(dates[0])}</Text>
            <Ionicons name="expand-outline" size={20} color={COLORS.primary} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            <View>
              {/* Day Names Row */}
              <View style={styles.dayNamesRow}>
                {dates.map((date, index) => (
                  <View key={index} style={styles.dayNameContainer}>
                    <Text style={styles.dayNameText}>{formatDayName(date)}</Text>
                  </View>
                ))}
              </View>

              {/* Date Numbers Row */}
              <View style={styles.datesRow}>
                {dates.map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dateBox, selectedDate?.toDateString() === date.toDateString() && styles.dateBoxSelected]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.dateNumber, selectedDate?.toDateString() === date.toDateString() && styles.dateTextSelected]}>
                      {formatDayNumber(date)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Time Period */}
        <View style={styles.section}>
          <View style={styles.timeHeaderRow}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <Text style={styles.slotsAvailable}>8 slots available for today.</Text>
          </View>
          <View style={styles.periodRow}>
            {Object.keys(TIME_PERIODS).map((key) => {
              const period = TIME_PERIODS[key];
              const config = PERIOD_CONFIG[period];
              const count = getSlotCount(period);
              const isSelected = selectedPeriod === period;

              return (
                <View key={key} style={styles.periodContainer}>
                  <TouchableOpacity
                    style={[styles.periodPill, isSelected && styles.periodPillSelected]}
                    onPress={() => {
                      setSelectedPeriod(period);
                      setSelectedSlot(null);
                      setDuration(1);
                    }}
                  >
                    <Ionicons name={config.icon} size={20} color={isSelected ? COLORS.white : COLORS.textSecondary} />
                    <Text style={[styles.periodText, isSelected && styles.periodTextSelected]}>{config.label}</Text>
                    <View style={[styles.countBadge, isSelected && styles.countBadgeSelected]}>
                      <Text style={[styles.countText, isSelected && styles.countTextSelected]}>{count}</Text>
                    </View>
                  </TouchableOpacity>
                  {isSelected && (
                    <Text style={styles.timeRange}>{config.displayTime}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Time Slots */}
        {timeSlots.length > 0 && (
          <View style={styles.timelineSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineScroll}>
              <View style={styles.timelineContainer}>
                {/* Time Labels */}
                <View style={styles.timeLabelsRow}>
                  {timeSlots.map((slot, index) => {
                    const startTime = slot.split(' - ')[0];
                    return (
                      <View key={index} style={styles.timeLabelContainer}>
                        <Text style={styles.timeLabel}>{startTime}</Text>
                      </View>
                    );
                  })}
                </View>

                {/* Timeline Line with Ticks */}
                <View style={styles.timelineLineContainer}>
                  {/* Base Line */}
                  <View style={styles.timelineBaseLine} />

                  {/* Highlighted Segment */}
                  {selectedSlot && (
                    <View style={[styles.timelineHighlight, {
                      left: timeSlots.indexOf(selectedSlot) * 80 + 40,
                      width: 80 * duration
                    }]} />
                  )}

                  {/* Vertical Ticks */}
                  {timeSlots.map((slot, index) => (
                    <View
                      key={index}
                      style={[styles.timelineTick, { left: index * 80 + 40 }]}
                    />
                  ))}

                  {/* Pointers */}
                  {selectedSlot && (
                    <>
                      {/* Start Pointer */}
                      <View style={[styles.timelinePointer, {
                        left: timeSlots.indexOf(selectedSlot) * 80 + 40
                      }]}>
                        <Ionicons name="caret-up-sharp" size={20} color={COLORS.primary} />
                      </View>

                      {/* End Pointer */}
                      <View style={[styles.timelinePointer, {
                        left: (timeSlots.indexOf(selectedSlot) + duration) * 80 + 40
                      }]}>
                        <Ionicons name="caret-up-sharp" size={20} color={COLORS.primary} />
                      </View>
                    </>
                  )}
                </View>

                {/* Touchable Areas */}
                <View style={styles.touchableRow}>
                  {timeSlots.map((slot, index) => {
                    const handleSlotPress = () => {
                      const selectedIndex = timeSlots.indexOf(selectedSlot);

                      if (selectedSlot === null) {
                        // First tap - set start slot
                        setSelectedSlot(slot);
                        setDuration(1);
                      } else if (index > selectedIndex) {
                        // Tapping after start slot - extend duration
                        const newDuration = index - selectedIndex + 1;
                        setDuration(newDuration);
                      } else if (index === selectedIndex) {
                        // Tapping on start slot - reset to 1 hour
                        setDuration(1);
                      } else {
                        // Tapping before current start - set new start
                        setSelectedSlot(slot);
                        setDuration(1);
                      }
                    };

                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.touchableSlot}
                        onPress={handleSlotPress}
                      />
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* Duration Indicator */}
            {selectedSlot && (
              <View style={styles.durationIndicator}>
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                <Text style={styles.durationText}>
                  Duration: {duration} {duration === 1 ? 'hour' : 'hours'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Separator */}
        <View style={styles.separator} />

        {/* Court Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Cricket Court</Text>
          <View style={styles.courtRow}>
            {turfData.courts.map((court) => (
              <TouchableOpacity
                key={court}
                style={[styles.courtCard, selectedCourt === court && styles.courtCardSelected]}
                onPress={() => setSelectedCourt(court)}
              >
                <View style={[styles.radio, selectedCourt === court && styles.radioSelected]}>
                  {selectedCourt === court && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.courtText, selectedCourt === court && styles.courtTextSelected]}>{court}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Player Count */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Players Count</Text>
          <View style={styles.playerCounter}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => playerCount > 1 && setPlayerCount(playerCount - 1)}
              disabled={playerCount <= 1}
            >
              <Ionicons name="remove" size={20} color={playerCount <= 1 ? COLORS.textTertiary : COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.playerCount}>{playerCount} Players</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => playerCount < 20 && setPlayerCount(playerCount + 1)}
              disabled={playerCount >= 20}
            >
              <Ionicons name="add" size={20} color={playerCount >= 20 ? COLORS.textTertiary : COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Price Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View style={styles.bottomLeft}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>₹ {totalPrice}</Text>
              <Text style={styles.priceLabel}> / {duration} {duration === 1 ? 'hour' : 'hours'}</Text>
            </View>
            <Text style={styles.perPlayerText}>
              ₹{Math.round(totalPrice / playerCount)} per player
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
    marginHorizontal: 16
  },
  section: { paddingHorizontal: 16, paddingVertical: 16 },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', marginBottom: 8 },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
    paddingVertical: 8
  },
  monthText: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
  dateScroll: { marginHorizontal: -16 },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 16,
    gap: 8
  },
  dayNameContainer: {
    width: 50,
    alignItems: 'center'
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase'
  },
  datesRow: {
    flexDirection: 'row',
    paddingLeft: 16,
    gap: 8
  },
  dateBox: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateBoxSelected: {
    backgroundColor: COLORS.primary
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary
  },
  dateTextSelected: {
    color: COLORS.white
  },
  timeHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  slotsAvailable: { fontSize: 14, color: COLORS.textSecondary },
  periodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8
  },
  periodContainer: {
    minWidth: '48%',
    marginBottom: 8
  },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 6
  },
  periodPillSelected: { backgroundColor: COLORS.black, borderColor: COLORS.black },
  periodText: { fontSize: 14, color: COLORS.textSecondary },
  periodTextSelected: { color: COLORS.white },
  countBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  countBadgeSelected: { backgroundColor: COLORS.white },
  countText: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary },
  countTextSelected: { color: COLORS.black },
  timeRange: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center'
  },
  timelineSection: {
    paddingVertical: 24,
    paddingHorizontal: 16
  },
  timelineScroll: {
    paddingHorizontal: 16
  },
  timelineContainer: {
    position: 'relative',
    height: 80
  },
  timeLabelsRow: {
    flexDirection: 'row',
    marginBottom: 16
  },
  timeLabelContainer: {
    width: 80,
    alignItems: 'center'
  },
  timeLabel: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600'
  },
  timelineLineContainer: {
    position: 'relative',
    height: 40,
    justifyContent: 'center'
  },
  timelineBaseLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.border,
    top: 10
  },
  timelineHighlight: {
    position: 'absolute',
    height: 3,
    backgroundColor: COLORS.primary,
    top: 9.5,
    zIndex: 1
  },
  timelineTick: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: COLORS.border,
    top: 4
  },
  timelinePointer: {
    position: 'absolute',
    bottom: 8,
    marginLeft: -10,
    zIndex: 2
  },
  touchableRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  touchableSlot: {
    width: 80,
    height: '100%'
  },
  durationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary
  },
  courtRow: { flexDirection: 'row', gap: 12 },
  courtCard: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  courtCardSelected: { borderColor: COLORS.primary, borderWidth: 2, backgroundColor: COLORS.white },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: COLORS.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  courtText: { fontSize: 16, color: COLORS.textPrimary },
  courtTextSelected: { color: COLORS.primary, fontWeight: '500' },
  playerCounter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12 },
  counterButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  playerCount: { fontSize: 16, fontWeight: '600' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  bottomLeft: {
    flex: 1
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.textSecondary
  },
  perPlayerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 4
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.6
  },
});

export default BookingScreen;
