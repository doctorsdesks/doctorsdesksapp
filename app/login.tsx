import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Login = () => {
    

    return (
        <View>
            <Text style={style.header} >Login page</Text>
        </View>
    )
}

const style = StyleSheet.create({
    header: {
        color: "pink"
    }
});

export default Login;