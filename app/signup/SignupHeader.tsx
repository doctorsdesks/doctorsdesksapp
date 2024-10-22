import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface SignUpHeaderProps {
    data: Array<{ label: string, status: string }>
  }

const SignUpHeader: React.FC<SignUpHeaderProps>  = ({data}) => {

    return (
        <View style={ { display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            {data?.map((item, index) => {
                const eachItemWidth = (width - 54) / data.length;
                return (
                    <View key={index} style={{ display: "flex", alignItems: "center", width: eachItemWidth }} >
                        <Text 
                            style={{ 
                                color: item?.status === "NOT_STARTED" ? "#A9A9AB" : "#1EA6D6", 
                                fontWeight: 600, 
                                fontSize: 14, 
                            }}
                        >
                            {item.label}
                        </Text>
                        <View style={{ position: 'relative', width: '100%' }} >
                            <View 
                                style={{ 
                                    width: '100%', 
                                    backgroundColor: "#A9A9AB",
                                    height: 6,
                                    marginTop: 8,
                                    borderRadius: 50,
                                }} 
                            />
                            <View 
                                style={{
                                    position: 'absolute',
                                    backgroundColor: "#1EA6D6",
                                    height: 6,
                                    marginTop: 8,
                                    borderRadius: 50,
                                    top: 0,
                                    left: 0,
                                    width: `${item?.status === "NOT_STARTED" ? 0 
                                        :  item?.status === "STARTED" ? "50" 
                                            : "100"}%`,
                                    zIndex: 1,
                                }}
                            />
                        </View>
                    </View>
                )
            })}
        </View>
    );
}


export default SignUpHeader;