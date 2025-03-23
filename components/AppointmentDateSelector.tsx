import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  useColorScheme,
} from 'react-native';
import CustomText from './CustomText';
import { Ionicons } from '@expo/vector-icons';
import { finalText } from './Utils';
import { useAppContext } from '@/context/AppContext';

interface AppointmentDateSelectorProps {
    handleDateChange: (date: string) => void;
}

const AppointmentDateSelector: React.FC<AppointmentDateSelectorProps> = ({ handleDateChange }) => {
  const { translations, selectedLanguage } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysToRender, setDaysToRender] = useState<Array<string>>([]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const colorSchema = useColorScheme();
  
  useEffect(() => {
    if (currentMonth) {
        const days = getDaysInMonth(currentMonth);
        setDaysToRender(days);
        let finalDate;
      
        if (selectedDay === "") {
          const today = new Date();
          const day = formatDay(today);
          const date = formatDate(today);
          if (date < 10) {
            finalDate = "0"+date;
          }
          setSelectedDay(`${day} ${date}`);
        } else {
          const [day, date] = selectedDay?.split(" ");
          if (parseInt(date) < 10) {
            finalDate = "0"+date;
          }
        }
        const year = currentMonth.getFullYear();
        let month: any = currentMonth.getMonth()+1;
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
    setLoader(!loader);
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

  // const isDaySelected = (day: Date) => {
  //   return formatDay(day) == formatDay(selectedDay) && formatDate(day).toString() == formatDate(selectedDay).toString()
  // };


  return (
    <View>
        <View style={styles.monthSelector}>
            <Pressable onPress={() => changeMonth('left')}>
                <Ionicons name='chevron-back-circle-outline' size={32} color={"#1EA6D6"} />
            </Pressable>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <CustomText
                    textStyle={styles.monthText}
                    text={finalText(formatMonthYear(currentMonth).split(' ')[0], translations, selectedLanguage)}
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
        {daysToRender?.length > 0 && <FlatList
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
                        backgroundColor: item === selectedDay ? '#1EA6D6' : "#fff",
                        borderWidth: 1,
                        borderColor: item === selectedDay ? '#1EA6D6' : "#D9D9D9", 
                    }} 
                    onPress={() => handleDaySelect(item)} 
                >
                    <View style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                    }}>
                        <CustomText
                            textStyle={{
                            fontSize: 12,
                            lineHeight: 12,
                            fontWeight: '600',
                            color: item === selectedDay ? '#FCFCFC' : "#32383D",
                            }}
                            text={item.split(" ")[0]}
                        />
                        <CustomText
                            textStyle={{
                            fontSize: 12,
                            lineHeight: 12,
                            fontWeight: '600',
                            color: item === selectedDay ? '#FCFCFC' : "#32383D",
                            marginTop: 4,
                            }}
                            text={item.split(" ")[1]}
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
            
        />}
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
