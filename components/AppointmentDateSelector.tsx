import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import CustomText from './CustomText';
import { Ionicons } from '@expo/vector-icons';

interface AppointmentDateSelectorProps {
    handleDateChange: (date: Date) => void;
}

const AppointmentDateSelector: React.FC<AppointmentDateSelectorProps> = ({ handleDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysToRender, setDaysToRender] = useState<Array<Date>>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    if (currentMonth) {
        const days = getDaysInMonth(currentMonth);
        setDaysToRender(days);
        setSelectedDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), formatDate(selectedDay)));
        handleDateChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), formatDate(selectedDay)));
    }
    
  },[currentMonth])

  useEffect(() => {
    if (flatListRef.current && daysToRender.length > 0) {
      const index = daysToRender.findIndex(
        (day) =>
          day.getDate() === selectedDay.getDate() &&
          day.getMonth() === selectedDay.getMonth() &&
          day.getFullYear() === selectedDay.getFullYear()
      );
      if (index !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: true });
        }, 0);
      }
    }
  }, [daysToRender, selectedDay]);

  const getDaysInMonth = (month: Date) => {
    const days = [];
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const startOfMonth = new Date(year, monthIndex, 1);
    const endOfMonth = new Date(year, monthIndex + 1, 0);

    let currentDay = new Date(startOfMonth);
    while (currentDay <= endOfMonth) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const changeMonth = (direction: string) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'left' ? -1 : 1));
      return newMonth;
    });
  };

  const formatMonthYear = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatDay = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const formatDate = (date: Date) => date.getDate();

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
    handleDateChange(day);
  }

  const isDaySelected = (day: Date) => formatDay(day) === formatDay(selectedDay) && formatDate(day).toString() === formatDate(selectedDay).toString();


  return (
    <View>
        <View style={styles.monthSelector}>
            <Pressable onPress={() => changeMonth('left')}>
                <Ionicons name='chevron-back-circle-outline' size={32} color={"#1EA6D6"} />
            </Pressable>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <CustomText
                    textStyle={styles.monthText}
                    text={formatMonthYear(currentMonth).split(' ')[0]}
                    multiLingual={true}
                />
                <CustomText
                    textStyle={[styles.monthText, { marginLeft: 8 }]}
                    text={formatMonthYear(currentMonth).split(' ')[1]}
                />
            </View>
            <Pressable onPress={() => changeMonth('right')}>
            <Ionicons name='chevron-forward-circle-outline' size={32} color={"#1EA6D6"} />
            </Pressable>
        </View>
        <FlatList
            ref={flatListRef}
            data={daysToRender}
            horizontal
            keyExtractor={(item) => item.toISOString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelector}
            initialScrollIndex={daysToRender.indexOf(selectedDay)}
            renderItem={({ item }) => (
                <Pressable 
                    style={{ 
                        borderRadius: 8,
                        backgroundColor: isDaySelected(item) ? '#1EA6D6' : "",
                        borderWidth: 1,
                        borderColor: isDaySelected(item) ? '#1EA6D6' : "#D9D9D9",
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        height: 40,
                        width: 62,
                        alignItems: 'center',
                        marginHorizontal: 5,
                    }} 
                    onPress={() => handleDaySelect(item)} 
                >
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CustomText
                            textStyle={{
                            fontSize: 12,
                            lineHeight: 12,
                            fontWeight: '600',
                            color: isDaySelected(item) ? '#FCFCFC' : "#32383D",
                            }}
                            text={formatDay(item)}
                        />
                        <CustomText
                            textStyle={{
                            fontSize: 12,
                            lineHeight: 12,
                            fontWeight: '600',
                            color: isDaySelected(item) ? '#FCFCFC' : "#32383D",
                            marginTop: 4,
                            }}
                            text={formatDate(item).toString()}
                        />
                    </View>
                </Pressable>
            )}
            getItemLayout={(data, index) => ({
                length: 72, 
                offset: 72 * index,
                index,
            })}
            onScrollToIndexFailed={(info) => {
                console.warn('Scroll to index failed:', info);
                setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                });
                }, 500);
            }}
            
        />
    </View>
  );
};

const styles = StyleSheet.create({
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '600',
    color: '#32383D',
  },
  daySelector: {
    paddingVertical: 8,
  }
});

export default AppointmentDateSelector;