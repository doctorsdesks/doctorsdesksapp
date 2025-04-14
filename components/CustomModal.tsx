import React from 'react';
import { Modal, Pressable, StyleSheet, View, useColorScheme, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, children }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { height } = Dimensions.get('window');

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable 
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.borderColorSelected,
                            height: height * 0.5 // 50% of screen height
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end', // Align to bottom
    },
    modalContent: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        overflow: 'hidden',
    },
});

export default CustomModal;
