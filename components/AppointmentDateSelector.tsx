import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { finalText } from './Utils';
import { useAppContext } from '@/context/AppContext';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import Icon from './Icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';

interface AppointmentDateSelectorProps {
    handleDateChange: (date: string) => void;
    source?: string;
}

const AppointmentDateSelector: React.FC<AppointmentDateSelectorProps> = ({ handleDateChange, source }) => {
  const { translations, selectedLanguage } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysToRender, setDaysToRender] = useState<Array<string>>([]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme() ?? 'light';
  
  useEffect(() => {
    if (currentMonth) {
      const days = getDaysInMonth(currentMonth);
      setDaysToRender(days);
      let finalDate;
      const year = currentMonth.getFullYear();
      let month: any = currentMonth.getMonth()+1;
      if (selectedDay === "") {
        const today = new Date();
        const day = formatDay(today);
        const date = formatDate(today);
        if (date < 10) {
          finalDate = "0"+date;
        } else {
          finalDate = date;
        }
        setSelectedDay(`${day} ${date}`);
      } else {
        const [day, date] = selectedDay?.split(" ");
        if (parseInt(date) < 10) {
          finalDate = "0"+date;
        } else {
          finalDate = date;
        }
        let dateForCurrentMonth = new Date(year, month - 1, parseInt(date));
        if (isLeftDisabled(currentMonth)) {
          if (parseInt(date) < new Date().getDate()) {
            finalDate = new Date().getDate()
            dateForCurrentMonth = new Date(year, month - 1, finalDate);
          }
        }
        const dayForCurrentMonth = formatDay(dateForCurrentMonth);
        const finalDay = `${dayForCurrentMonth} ${finalDate}`;
        setSelectedDay(finalDay);
      }
      if (month < 10) {
        month = "0" + month;
      }
      const newDate = `${year}-${month}-${finalDate}`;
      handleDateChange(newDate);
  }
    
  },[currentMonth])

  useEffect(() => {
    const today = new Date();
    const day = formatDay(today);
    const date = formatDate(today);
    setSelectedDay(`${day} ${date}`);
  },[])

  useEffect(() => {
    if (flatListRef.current && daysToRender.length > 0) {
      const index = daysToRender.findIndex(
        (day) =>
          day === selectedDay
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
      const dayToPush = new Date(currentDay);
      const day = formatDay(dayToPush);
      const date = formatDate(dayToPush)
      days.push(`${day} ${date}`);
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const isLeftDisabled = (monthSet: any) => {
    const cMonth = new Date(monthSet);
    const today = new Date();
    const month = cMonth.getMonth();
    const year = cMonth.getFullYear();
    if (source === "blockSlot" && today.getMonth() === month && today.getFullYear() === year) {
      return true;
    } else return false;
  }

  const isSlotDisabled = (item: string) => {
    if (isLeftDisabled(currentMonth)) {
      const today = new Date();
      const currentDate = formatDate(today)
      const slotDate = item?.split(" ")[1];
      if (parseInt(slotDate) < currentDate) {
        return true;
      } else return false;
    } else return false;
  }

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

  const handleDaySelect = (day: string) => {
    let [currentDay, date] = day?.split(" ");
    setSelectedDay(day);
    const year = currentMonth.getFullYear();
    let month: any = currentMonth.getMonth()+1;
    if (month < 10) {
      month = "0" + month;
    }
    if (parseInt(date) < 10) {
      date = "0"+date
    }
    const newDate = `${year}-${month}-${date}`;
    handleDateChange(newDate);
  }


  return (
    <ThemedView>
        <View style={styles.monthSelector}>
            <Pressable onPress={() => !isLeftDisabled(currentMonth) && changeMonth('left')}>
              <Icon type="arrowCircleLeft" fill={isLeftDisabled(currentMonth) ? Colors[colorScheme].iconDisabled : "#1EA6D6"} />
            </Pressable>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <ThemedText style={styles.monthText} >{finalText(formatMonthYear(currentMonth).split(' ')[0], translations, selectedLanguage)}</ThemedText>
                <ThemedText style={[styles.monthText, { marginLeft: 8 }]} >{formatMonthYear(currentMonth).split(' ')[1]}</ThemedText>
            </View>
            <Pressable onPress={() => changeMonth('right')}>
              <Icon type="arrowCircleRight" />
            </Pressable>
        </View>
        {daysToRender?.length > 0 && 
          <FlatList
            ref={flatListRef}
            data={daysToRender}
            horizontal
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelector}
            initialScrollIndex={daysToRender.indexOf(selectedDay)}
            renderItem={({ item }) => (
                <Pressable 
                    style={{ 
                        borderRadius: 8,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        height: 40,
                        width: 62,
                        alignItems: 'center',
                        marginHorizontal: 5,
                        backgroundColor: isSlotDisabled(item) ? Colors[colorScheme].iconDisabled : item === selectedDay ? '#1EA6D6' : "#fff",
                        borderWidth: 1,
                        borderColor: item === selectedDay ? '#1EA6D6' : "#D9D9D9", 
                    }} 
                    onPress={() => !isSlotDisabled(item) && handleDaySelect(item)} 
                >
                    <View style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                    }}>
                        <ThemedText style={{ fontSize: 12, lineHeight: 16, fontWeight: '600', color: item === selectedDay ? '#FCFCFC' : "#32383D" }}>{finalText(item.split(" ")[0], translations, selectedLanguage)}</ThemedText>
                        <ThemedText style={{ fontSize: 12, lineHeight: 12, fontWeight: '600', color: item === selectedDay ? '#FCFCFC' : "#32383D", marginTop: 4 }}>{item.split(" ")[1]}</ThemedText>
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
        }
    </ThemedView>
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
    lineHeight: 20,
    fontWeight: '600',
  },
  daySelector: {
    paddingVertical: 8,
  }
});

export default AppointmentDateSelector;
