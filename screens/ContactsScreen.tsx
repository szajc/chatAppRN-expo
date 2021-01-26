import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

import { View } from '../components/Themed';
import ContactListItem from '../components/ContactListItem/ContactListItem';
import users from '../data/Users';
import NewMessageButton from '../components/NewMessageButton/NewMessageButton';
import { graphqlOperation, API } from 'aws-amplify';
import { listUsers } from '../graphql/queries';


export default function ContactsScreen() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await API.graphql(
          graphqlOperation(
            listUsers
          )
        )
        setUsers(usersData.data.listUsers.items);
      } catch (error) {
        console.log(error)
      }
    }
    fetchUsers();
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        style={{width: '100%'}}
        data={users} 
        renderItem={({ item }) => <ContactListItem user={item} />} 
        keyExtractor={(item) => item.id}
      />
      <NewMessageButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
