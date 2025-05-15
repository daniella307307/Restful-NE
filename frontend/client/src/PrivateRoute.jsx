import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

function PrivateRoute({children}) {
    const getToken= AsyncStorage.getItem('userId','token')
    if(!getToken){
        return <div>
            <h1>Please do login</h1>
        </div>
    }else{
        return <children/>
    }
  return (
    <div>
      
    </div>
  );
}

export default PrivateRoute;
