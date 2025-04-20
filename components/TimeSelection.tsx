import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import CustomButton from './CustomButton';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { finalText } from './Utils';
import { useAppContext } from '@/context/AppContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';

const { width } = Dimensions.get('window');

interface TimePickerProps {
  handleTimeSelection?: (hour: string, minute: string, period: string) => void;
  title: string;
  time: string;
  closeLoserPanel: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ handleTimeSelection, title, time, closeLoserPanel }) => {
  const { translations, selectedLanguage } = useAppContext();
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("AM");
  
  const [hours] = useState<Array<string>>(Array.from({ length: 12 }, (_, i) => (i+1).toString().padStart(2, '0')));
  const [minutes] = useState<Array<string>>(Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')));
  const [periods] = useState<Array<string>>(["AM", "PM"]);

  const periodListRef = useRef<FlatList<string>>(null);
  const minuteListRef = useRef<FlatList<any>>(null);
  const hourListRef = useRef<FlatList<any>>(null);

  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    if (time) {
        const [hh, other] = time?.split(":");
        const [mm, pr] = other?.split(" ");
        if (parseInt(hh) > 12) {
            setSelectedPeriod("PM");
            let currentHh = parseInt(hh) - 12;
            if (currentHh === 0) {
                currentHh = 12;
            }
            setSelectedHour((currentHh).toString());
        } else {
            setSelectedHour(hh);
            setSelectedPeriod(pr);
        }
        setSelectedMinute(mm);
    }
  }, [time]);

  useEffect(() => {
    // Scroll to the selected period when it changes
    if (periodListRef.current) {
      const index = periods.indexOf(selectedPeriod);
      if (index !== -1) periodListRef.current.scrollToIndex({ index, animated: true });
    }
  }, [selectedPeriod]);

  useEffect(() => {
    // Scroll to the selected minute when it changes
    if (minuteListRef.current) {
      const index = minutes.indexOf(selectedMinute);
      if (index !== -1) minuteListRef.current.scrollToIndex({ index, animated: true });
    }
  }, [selectedMinute]);

  useEffect(() => {
    // Scroll to the selected minute when it changes
    if (hourListRef.current) {
      const index = hours.indexOf(selectedHour);
      if (index !== -1) hourListRef.current.scrollToIndex({ index, animated: true });
    }
  }, [selectedHour]);

  useEffect(() => {
    // Scroll to the selected period when it changes
    if (periodListRef.current) {
      const index = periods.indexOf(selectedPeriod);
      periodListRef.current.scrollToIndex({ index, animated: true });
    }
  }, [selectedPeriod]);

  const handleScroll = (type: 'hour' | 'minute' | 'period', index: number) => {
    if (type === 'hour') {
      setSelectedHour(hours[index % hours.length]);
    } else if (type === 'minute') {
      setSelectedMinute(minutes[index % minutes.length]);
    } else if (type === 'period') {
      setSelectedPeriod(periods[index % periods.length]);
    }
  };

  const onScrollEnd = (event: any, type: 'hour' | 'minute' | 'period', data: string[]) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / 60);
    if (index >= 0 && index < data.length) {
      handleScroll(type, index);
    }
  };

  const handleItemPressed = (type: string, item: any) => {
    switch (type) {
      case 'hour':
        setSelectedHour(item);
        break;
      case 'minute':
        setSelectedMinute(item);
        break;
      case 'period':
        setSelectedPeriod(item);
        break;
      default:
        break;
    }
  }

  const renderItem = (item: string, selectedItem: string, type: string) => {
    const isSelected = item === selectedItem;
    return (
      <Pressable onPress={() => handleItemPressed(type, item)} style={styles.item}>
        <ThemedText lightColor={isSelected ? Colors[colorScheme].textSelected : Colors[colorScheme].textNotSelected} darkColor={isSelected ? Colors[colorScheme].textSelected : Colors[colorScheme].textNotSelected} style={styles.text}>{item}</ThemedText>
      </Pressable>
    );
  };

  const handleDone = () => {
    handleTimeSelection && handleTimeSelection(selectedHour, selectedMinute, selectedPeriod);
    closeLoserPanel();
  };

  return (
    <ThemedView style={{ padding: 16 }} >
      <ThemedText style={{ fontSize: 16, lineHeight: 20, marginTop: 16, fontWeight: "600" }} >{finalText(title, translations, selectedLanguage)} </ThemedText>
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <FlatList
          ref={hourListRef}
          data={hours}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => renderItem(item, selectedHour, 'hour')}
          snapToInterval={60}
          decelerationRate="fast"
          getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}
          initialScrollIndex={Math.max(hours.indexOf(selectedHour),0)}
          onMomentumScrollEnd={(event) => onScrollEnd(event, 'hour', hours)}
          style={styles.picker}
          contentContainerStyle={[styles.flatListContainer, { paddingTop: 60, paddingBottom: 60 }]} // Equal padding for proper centering
        />
        <FlatList
          ref={minuteListRef}
          data={minutes}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => renderItem(item, selectedMinute, 'minute')}
          snapToInterval={60}
          decelerationRate="fast"
          getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}
          initialScrollIndex={Math.max(minutes.indexOf(selectedMinute),0)}
          onMomentumScrollEnd={(event) => onScrollEnd(event, 'minute', minutes)}
          style={styles.picker}
          contentContainerStyle={[styles.flatListContainer, { paddingTop: 60, paddingBottom: 60 }]}
        />
        <FlatList
          ref={periodListRef}
          data={periods}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderItem(item, selectedPeriod, 'period')}
          snapToInterval={60}
          decelerationRate="fast"
          getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}
          initialScrollIndex={Math.max(periods.indexOf(selectedPeriod),0)}
          onMomentumScrollEnd={(event) => onScrollEnd(event, 'period', periods)}
          style={styles.picker}
          contentContainerStyle={[styles.flatListContainer, { paddingTop: 60, paddingBottom: 60 }]}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton multiLingual={true} width='HALF' title="Cancel" onPress={closeLoserPanel} textColor="#009688" containerStyle={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#009688" }} />
        <CustomButton multiLingual={true} width='HALF' title="Done" onPress={handleDone} />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: width / 4,
    height: 180, // Height for exactly 3 items (60px each)
  },
  flatListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    paddingHorizontal: 30,
    height: 60, // Fixed height for each item
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    marginTop: 24,
  },
});

export default TimePicker;
