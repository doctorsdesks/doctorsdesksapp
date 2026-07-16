import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import {
  NotificationCategory,
  NotificationType,
} from '@/constants/Enums';

import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import Icon from './Icons';

import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

import { Ionicons } from '@expo/vector-icons';

type Props = {
  notification: NotificationType;
  onAccept?: () => void;
  onReject?: () => void;
  onNotificationClick: () => void;
  selectedNotification?: string;
};

const EachNotification: React.FC<Props> = ({
  notification,
  onAccept,
  onReject,
  onNotificationClick,
  selectedNotification,
}) => {

  const colorScheme = useColorScheme() || 'light';

  const isExpanded =
    selectedNotification === notification.id;

  const progress = useSharedValue(
    isExpanded ? 1 : 0
  );

  useEffect(() => {
    progress.value = withTiming(
      isExpanded ? 1 : 0,
      {
        duration: 250,
      }
    );
  }, [isExpanded]);

  const animatedActionStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      maxHeight: interpolate(
        progress.value,
        [0, 1],
        [0, 90]
      ),
      marginTop: interpolate(
        progress.value,
        [0, 1],
        [0, 16]
      ),
      overflow: 'hidden',
    };
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(
            progress.value,
            [0, 1],
            [0, 180]
          )}deg`,
        },
      ],
    };
  });

  const animatedUnreadDot = useAnimatedStyle(() => ({
    opacity: withTiming(
      notification.isRead ? 0 : 1,
      { duration: 250 }
    ),
    transform: [
      {
        scale: withTiming(
          notification.isRead ? 0 : 1,
          { duration: 250 }
        ),
      },
    ],
  }));

  return (
    <ThemedView>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onNotificationClick}
        style={[
          styles.container,
          {
            borderBottomColor:
              Colors[colorScheme].divider,
          },
          isExpanded && styles.expandedContainer,
        ]}
      >
        <View style={styles.iconWrapper}>
          <Icon type={notification.icon ?? 'confirmed'} />
        </View>

        <View style={styles.content}>

          <View style={styles.headerRow}>

            <ThemedText style={styles.title}>
              {notification.title}
            </ThemedText>

            <Animated.View style={animatedChevronStyle}>
              <Ionicons
                name="chevron-down"
                size={18}
                color="#8E8E93"
              />
            </Animated.View>

          </View>

          <ThemedText style={styles.body}>
            {notification.body}
          </ThemedText>

          {(notification?.category === NotificationCategory.APPOINTMENT_REQUEST || notification?.category === NotificationCategory.DOCTOR_JOINING_REQUEST) && <Animated.View
            style={[
              styles.actionWrapper,
              animatedActionStyle,
            ]}
          >
            <View style={styles.separator} />
            {/* <ThemedText style={styles.question}>
              Would you like to continue?
            </ThemedText> */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.rejectButton,
                ]}
                activeOpacity={0.8}
                onPress={onReject}
              >
                <ThemedText style={styles.rejectText}>
                  Reject
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.acceptButton,
                ]}
                activeOpacity={0.8}
                onPress={onAccept}
              >
                <ThemedText style={styles.acceptText}>
                  Accept
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>}
        </View>
        <Animated.View
          style={[
            styles.unreadDot,
            animatedUnreadDot,
          ]}
        />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default EachNotification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF1F4',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
  },

  expandedContainer: {
    backgroundColor: '#F2FCFB',
    borderColor: '#C9ECE8',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F8F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginRight: 10,
  },

  body: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#009688',
    marginTop: 6,
    marginLeft: 10,
  },

  actionWrapper: {
    overflow: 'hidden',
  },

  separator: {
    height: 1,
    backgroundColor: '#DDE5E8',
    marginBottom: 14,
  },

  question: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 14,
    fontWeight: '500',
  },

  actionContainer: {
    flexDirection: 'row',
  },

  button: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rejectButton: {
    backgroundColor: '#FFF2F2',
    borderWidth: 1,
    borderColor: '#F5C2C2',
    marginRight: 10,
  },

  acceptButton: {
    backgroundColor: '#009688',
    marginLeft: 10,
  },

  rejectText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '700',
  },

  acceptText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});