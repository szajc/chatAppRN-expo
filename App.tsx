import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { getUser } from './graphql/queries';
import { createUser } from './graphql/mutations';
import { withAuthenticator } from 'aws-amplify-react-native'
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config)

const randomImages = [
  'https://hieumobile/wp-content/uploads/avatar-among-us-2.jpg',
  'https://hieumobile/wp-content/uploads/avatar-among-us-3.jpg',
  'https://hieumobile/wp-content/uploads/avatar-among-us-6.jpg',
  'https://hieumobile/wp-content/uploads/avatar-among-us-9.jpg'
]

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const getRandomImg = () => {
    const rand = Math.floor(Math.random() * randomImages.length);
    return randomImages[rand];
  }

  // run this snippet only when app is first mounted
  useEffect(() => {
    const fetchUser = async () => {
      // get authenticated uer from auth
      const userInfo = await Auth.currentAuthenticatedUser( { bypassCache: true})
      console.log(userInfo);
      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(
            getUser,
            { id: userInfo.attributes.sub }
          )
        )
        if (userData.data.getUser) {
          console.log("user is already registered in DB")
          return;
        }
        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri: getRandomImg(),
          status: 'Hey, I am using whatsApp',
        }

        await API.graphql(
          graphqlOperation(
            createUser,
            { input: newUser }
          )
        )
      }
    }

    fetchUser();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
export default withAuthenticator(App);
