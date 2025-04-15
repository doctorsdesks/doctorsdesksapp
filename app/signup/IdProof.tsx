import Header from '@/components/Header';
import IdProofCard from '@/components/IdProofCard';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface IdProofProps {
    idProofData: any;
}

const IdProof: React.FC<IdProofProps> = ({ idProofData }) => {

    return (
        <ThemedView 
            style={{ 
                display: 'flex',
            }} 
        >
            <View style={{ marginTop: 16}}>
                <Header label="Upload Registration Certificate" />
                <Pressable
                    onPress={() => {
                        !idProofData[0]?.isUploaded &&
                        router.replace({
                            pathname: '/uploadCard',
                            params: {
                                docType: "Registration",
                                docId: idProofData[0]?.id
                            }
                        })
                    }}
                >
                    <IdProofCard data={idProofData[0]} type="Registration" />
                </Pressable>
            </View>
            <View style={{ marginTop: 32}} >
                <Header label="Choose Address Proof" />
                <Pressable
                    onPress={() => {
                        router.replace({
                            pathname: '/uploadCard',
                            params: {
                                docType: "Aadhar",
                                docId: idProofData[1]?.id
                            }
                        })
                    }}
                >
                    <IdProofCard data={idProofData[1]} type="Aadhar" />
                </Pressable>
                <Pressable
                    onPress={() => {
                        router.replace({
                            pathname: '/uploadCard',
                            params: {
                                docType: "Pan",
                                docId: idProofData[2]?.id
                            }
                        })
                    }}
                >
                    <IdProofCard data={idProofData[2]} type="Pan" />
                </Pressable>
            </View>
            
        </ThemedView>
    )
}

export default IdProof;