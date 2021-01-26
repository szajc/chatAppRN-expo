import React from 'react';
import { FlatList, ImageBackground } from 'react-native';

import { useRoute } from '@react-navigation/native';

import chatRoomData from '../data/Chats';
import ChatMessage from '../components/ChatMessage/ChatMessage';
import BG from '../assets/images/BG.png';
import InputBox from '../components/InputBox/InputBox';

const ChatRoomScreen = () => {
    
    const route = useRoute();

    return (
        <ImageBackground style={{width: '100%', height: '100%'}} source={BG}>
            <FlatList 
                data={chatRoomData.messages} 
                renderItem={({ item }) => <ChatMessage message={item} />} 
                keyExtractor={( item ) => item.id}
                inverted
            />
            <InputBox chatRoomID={route.params.id} />
        </ImageBackground>
    );
}

export default ChatRoomScreen;