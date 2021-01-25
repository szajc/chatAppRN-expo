import React, { useState } from 'react';
import { NativeSyntheticEvent, Text, View } from 'react-native';
import styles from './styles';

import { MaterialCommunityIcons, FontAwesome5, Entypo, Fontisto, MaterialIcons } from '@expo/vector-icons'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

const InputBox = () => {
    
    const [message, setMessage] = useState('');

    const onMicrophonePress = () => {
        console.warn(`Microphone!`)
    }

    const onSendPress = () => {
        console.warn(`sending: ${message}`)

        // send message to the backend
    }

    const onPress = () => {
        !message ? onMicrophonePress() : onSendPress();
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <FontAwesome5 name="laugh-beam" size={24} color="gray" />
                <TextInput
                    placeholder={"type a message"}
                    style={styles.textInput}
                    multiline
                    value={message}
                    onChangeText={message => setMessage(message)}
                />
                <Entypo name="attachment" size={24} color="gray" style={styles.icon}/>
                {!message  && <Fontisto name="camera" size={24} color="gray" style={styles.icon} />}
            </View>
            <TouchableOpacity 
                onPress={onPress}
            >
                <View style={styles.buttonContainer}>
                {!message ? 
                    <MaterialCommunityIcons name="microphone" size={28} color="white"/> :
                    <MaterialIcons name="send" size={28} color="white"/>
                }
            </View>
            </TouchableOpacity>
            
        </View>
    )
}

export default InputBox;