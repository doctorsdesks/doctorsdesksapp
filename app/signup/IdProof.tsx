import Header from '@/components/Header';
import IdProofCard from '@/components/IdProofCard';
import IdProofCardUpdate from '@/components/IdProofCardUpdate';
import { CardProps } from '@/constants/Enums';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface IdProofProps {
    data: Array<CardProps>;
}

const IdProof: React.FC<IdProofProps> = ({ data }) => {

    return (
        <View 
            style={{ 
                display: 'flex',
            }} 
        >
            <View style={{ marginTop: 16}}>
                <Header label="Upload Registration Card" />
                <Pressable
                    onPress={() => {
                        router.replace({
                            pathname: '/uploadCard',
                            params: {
                                docType: "Registration",
                                docId: data[0]?.id
                            }
                        })
                    }}
                >
                    <IdProofCard data={data[0]} />
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
                                docId: data[1]?.id
                            }
                        })
                    }}
                >
                    <IdProofCard data={data[1]} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        router.replace({
                            pathname: '/uploadCard',
                            params: {
                                docType: "Pan",
                                docId: data[2]?.id
                            }
                        })
                    }}
                >
                    <IdProofCard data={data[2]} />
                </Pressable>
            </View>
            
        </View>
    )
}

export default IdProof;