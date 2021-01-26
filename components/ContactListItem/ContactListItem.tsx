import moment from 'moment';
import React from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableWithoutFeedback 
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import styles from './style';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import {
    createChatRoom,
    createChatRoomUser
} from '../../graphql/mutations';

export type ContactListItemProps = {
    user: User;
}

const ContactListItem = ( props: ContactListItemProps ) => {
    
    const { user } = props;

    const navigation = useNavigation();
    
    const onClick = async () => {
        try {
            // create a new chatroom
            const newChatRoomData = await API.graphql(
                graphqlOperation(
                   createChatRoom,
                   { input: {} }
                )
            )

            if (!newChatRoomData.data) {
                return;
            }

            const newChatRoom = newChatRoomData.data.createChatRoom;
            
            // add user to the chatroom
            await API.graphql(
                graphqlOperation(
                    createChatRoomUser,
                    {   
                        input: {
                            userID: user.id,
                            chatRoomID: newChatRoom.id, 
                        }
                    }
                )
            )

            // add authenticated user to the chat room
            const userInfo = await Auth.currentAuthenticatedUser();
            await API.graphql(
                graphqlOperation(
                    createChatRoomUser,
                    {
                        input: {
                            userID: userInfo.attributes.sub,
                            chatRoomID: newChatRoom.id,
                        }
                    }
                )
            )

            navigation.navigate('ChatRoom', { 
                id: newChatRoom.id,
                name: "hardcoded name",
            });

        } catch (error) {
            console.log(error)
        }
        //console.warn(`clicked on ${user.name}`);
    }

    return (
        <TouchableWithoutFeedback
            onPress={onClick} 
        >
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Image 
                        source={{ uri: user.imageUri }} 
                        style={styles.avatar} 
                    />
                    <View style={styles.midContainer}>
                        <Text style={styles.username}>{user.name}</Text>
                        <Text 
                            numberOfLines={2}
                            style={styles.status}>
                                {user.status}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
};

export default ContactListItem;