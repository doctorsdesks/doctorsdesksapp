import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import CustomButton from './CustomButton';

const { width } = Dimensions.get('window');

interface TimePickerProps {
  handleTimeSelection?: (hour: string, minute: string, period: string) => void;
  title: string;
  time: string;
  closeLoserPanel: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ handleTimeSelection, title, time, closeLoserPanel }) => {
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<string>('AM');
  const [hours] = useState<Array<string>>(Array.from({ length: 12 }, (_, i) => (i+1).toString().padStart(2, '0')));
  const [minutes] = useState<Array<string>>(Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')));
  const [periods] = useState<Array<string>>(["AM", "PM"]);

  useEffect(() => {
    if (time) {
        const [hh, mm] = time.split(":");
        if (parseInt(hh) > 12) {
            setSelectedPeriod("PM");
            let currentHh = parseInt(hh) - 12;
            if (currentHh === 0) {
                currentHh = 12;
            }
            setSelectedHour((currentHh).toString())
        }
        setSelectedMinute(mm);
    }
  },[time])

  const handleScroll = (
    type: 'hour' | 'minute' | 'period',
    index: number
  ) => {
    if (type === 'hour') {
      setSelectedHour(hours[index % hours.length]);
    } else if (type === 'minute') {
      setSelectedMinute(minutes[index % minutes.length]);
    } else if (type === 'period') {
      setSelectedPeriod(periods[index % periods.length]);
    }
  };

  const renderItem = (item: number | string, selectedItem: number | string) => {
    const isSelected = item === selectedItem;
    return (
      <View style={styles.item}>
        <Text style={[styles.text, isSelected && styles.selectedText]}>
          {item}
        </Text>
      </View>
    );
  };

  const handleDone = () => {
    handleTimeSelection && handleTimeSelection(selectedHour, selectedMinute, selectedPeriod);
    closeLoserPanel();
  }

  return (
    <View style={{ }} >
        <Text style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} >
            {title}
        </Text>
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>
            <View style={{ height: 180 }} >
                <FlatList
                    data={hours}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => renderItem(item, selectedHour)}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={60}
                    decelerationRate="fast"
                    getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}
                    initialScrollIndex={hours.indexOf(selectedHour)}
                    onScroll={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.y / 60);
                        handleScroll('hour', index);
                    }}
                    style={styles.picker}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>
            <View style={{ height: 180 }} >
                <FlatList
                    data={minutes}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => renderItem(item, selectedMinute)}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={60}
                    decelerationRate="fast"
                    getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}
                    initialScrollIndex={minutes.indexOf(selectedMinute)}
                    onScroll={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.y / 60);
                        handleScroll('minute', index);
                    }}
                    style={styles.picker}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>
            <View style={{ height: 180 }} >
                <FlatList
                    data={periods}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => renderItem(item, selectedPeriod)}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={60}
                    decelerationRate="fast"
                    getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}
                    initialScrollIndex={periods.indexOf(selectedPeriod)}
                    onScroll={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.y / 60);
                        handleScroll('period', index);
                    }}
                    style={styles.picker}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>
        </View>
        <View style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', marginTop: 32 }} >
            <CustomButton width='HALF' title="Cancel" onPress={closeLoserPanel} textColor="#009688" containerStyle={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#009688" }} />
            <CustomButton width='HALF' title="Done" onPress={handleDone} />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: width / 4,
    height: 200,
  },
  flatListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  item: {
    paddingHorizontal: 30,
    paddingVertical: 16,

  },
  text: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 600,
    color: '#A9A9AB',
  },
  selectedText: {
    color: '#32383D',
  },
});

export default TimePicker;

