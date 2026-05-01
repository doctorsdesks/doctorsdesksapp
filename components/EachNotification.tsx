import { NotificationType } from '@/constants/Enums';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ThemedView } from './ThemedView';
import Icon from './Icons';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

type Props = {
  notification: NotificationType;
  onPress: () => void;
};

const EachNotification: React.FC<Props> = ({ notification, onPress }) => {
    const colorSchema = useColorScheme() || 'light';
    return (
        <ThemedView>
            <TouchableOpacity
                style={[
                    styles.container,
                    { borderBottomColor: Colors[colorSchema].divider }
                ]}
                onPress={() => !notification.isRead && onPress()}
                activeOpacity={0.7}
            >
                <View style={styles.iconWrapper}>
                    <Icon type={notification?.icon ?? "confirmed"} />
                </View>

                <View style={styles.content}>
                    <ThemedText style={styles.title}>{notification.title}</ThemedText>
                    <ThemedText style={[styles.body]}>{notification.body}</ThemedText>
                </View>
                {!notification.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F33',
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#EAF4F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 600,
    marginBottom: 4,
  },
  body: {
    fontSize: 10,
    fontWeight: 400,
    lineHeight: 16,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#009688',
  },
});


export default EachNotification;
