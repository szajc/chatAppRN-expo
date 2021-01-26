import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground } from 'react-native';

import { useRoute } from '@react-navigation/native';

import ChatMessage from '../components/ChatMessage/ChatMessage';
import BG from '../assets/images/BG.png';
import InputBox from '../components/InputBox/InputBox';

import {
    API,
    Auth,
    graphqlOperation,
} from 'aws-amplify'
import { messagesByChatRoom } from '../graphql/queries';

const ChatRoomScreen = () => {
    
    const [messages, setMessages] = useState([]);
    const [myId, setMyId] = useState('');
    const route = useRoute();

    const fetchMessages = async () => {
        const messagesData = await API.graphql(
            graphqlOperation(
                messagesByChatRoom, {
                    chatRoomID: route.params.id,
                    sortDirection: "DESC"
                } 
            )
        )
        setMessages(messagesData.data.messagesByChatRoom.items);
    }

    useEffect(() => {
        fetchMessages();
    }, [])

    useEffect(() => {
        const getMyId = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setMyId(userInfo.attributes.sub);
        }
        getMyId();
    }, [])

    return (
        <ImageBackground style={{width: '100%', height: '100%'}} source={BG}>
            <FlatList 
                data={messages} 
                renderItem={({ item }) => <ChatMessage myId={myId} message={item} />}
                inverted
            />
            <InputBox chatRoomID={route.params.id} />
        </ImageBackground>
    );
}

export default ChatRoomScreen;