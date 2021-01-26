import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ChatRoom } from '../../types';
import { useNavigation } from '@react-navigation/native';

import styles from './style';
import {
    Auth,
} from 'aws-amplify';

export type ChatListItemProps = {
    chatRoom: ChatRoom;
}

const ChatListItem = ( props: ChatListItemProps ) => {
    
    const { chatRoom } = props;
    const [otherUser, setOtherUser] = useState(null);

    const navigation = useNavigation();
    
    useEffect(() => {
        const getOtherUser = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            if (chatRoom.chatRoomUsers.items[0].user.id === userInfo.attributes.sub) {
                setOtherUser(chatRoom.chatRoomUsers.items[1].user)
            } else {
                setOtherUser(chatRoom.chatRoomUsers.items[0].user)
            }
            const user = chatRoom.chatRoomUsers.items[0].user;
        }
        getOtherUser();
    }, [])

    const onClick = () => {
        navigation.navigate('ChatRoom', { 
            id: chatRoom.id,
            name: otherUser.name,
        });
        //console.warn(`clicked on ${user.name}`);
    }

    return (
        <TouchableWithoutFeedback
            onPress={onClick} 
        >
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Image 
                        source={{ uri: otherUser && otherUser.imageUri }} 
                        style={styles.avatar} 
                    />
                    <View style={styles.midContainer}>
                        <Text style={styles.username}>{otherUser && otherUser.name}</Text>
                        <Text 
                            numberOfLines={1} 
                            style={styles.lastMessage}>
                                {chatRoom.lastMessage  ? 
                                    chatRoom.lastMessage.content.length>20 ? 
                                    chatRoom.lastMessage.content.slice(0,17) + "..." : 
                                    chatRoom.lastMessage.content : 
                                ""}
                        </Text>
                    </View>
                </View>
                
                <Text style={styles.time}>
                    {chatRoom.lastMessage && moment(chatRoom.lastMessage.createdAt).format('DD/MM/YYYY')}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    )
};

export default ChatListItem;