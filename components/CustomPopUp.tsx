import React from 'react';
import { Modal, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CustomPopUpProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const CustomPopUp: React.FC<CustomPopUpProps> = ({ visible, onClose, children }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable 
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: colors.background,
                            borderColor: colorScheme === 'light' ? '#fff' : colors.borderColorSelected,
                        }
                    ]}
                    onPress={e => e.stopPropagation()}
                >
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-start',
        paddingTop: 240,
    },
    modalContent: {
        marginHorizontal: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
});

export default CustomPopUp;
