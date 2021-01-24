import moment from 'moment';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { ChatRoom } from '../../types';

import styles from './style';

export type ChatListItemProps = {
    chatRoom: ChatRoom;
}

const ChatListItem = ( props: ChatListItemProps ) => {
    
    const { chatRoom } = props;
    const user = chatRoom.users[1];
    const message = chatRoom.lastMessage.content;
    const time = chatRoom.lastMessage.createdAt;

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Image 
                    source={{ uri: user.imageUri }} 
                    style={styles.avatar} 
                />
                <View style={styles.midContainer}>
                    <Text style={styles.username}>{user.name}</Text>
                    <Text numberOfLines={1} style={styles.lastMessage}>{message.length>20 ? message.slice(0,17) + "..." : message}</Text>
                </View>
            </View>
            
            <Text style={styles.time}>
                {moment(time).format('DD/MM/YYYY')}
            </Text>
        </View>
    )
};

export default ChatListItem;