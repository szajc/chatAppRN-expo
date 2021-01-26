import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import styles from './styles';

import { MaterialCommunityIcons, FontAwesome5, Entypo, Fontisto, MaterialIcons } from '@expo/vector-icons'
import { ForceTouchGestureHandler, TextInput, TouchableOpacity } from 'react-native-gesture-handler';

import {
    API,
    Auth,
    graphqlOperation,
} from 'aws-amplify';
import { createMessage } from '../../graphql/mutations'; 

const InputBox = (props: any) => {
    
    const { chatRoomID } = props;

    const [message, setMessage] = useState('');
    const [myUserId, setMyUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setMyUserId(userInfo.attributes.sub);
        }
        fetchUser();
    }, [])

    const onMicrophonePress = () => {
        console.warn(`Microphone not imp. yet!`)
    }

    const onSendPress = async () => {
        //console.warn(`sending: ${message}`)
        try {
            await API.graphql(
                graphqlOperation(
                    createMessage,{
                        input: {
                            content: message,
                            userID: myUserId,
                            chatRoomID 
                        }
                    }
                )
            )
            setMessage("");
        } catch (error) {
            console.log(error)
        }
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