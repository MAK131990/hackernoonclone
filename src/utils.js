import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

export const timeAgo = (date) => {
    return moment(date).fromNow();
};

export const saveToAsync = async (key, val) => {
    try {
        await AsyncStorage.setItem(key, val);
        return true
    } catch (error) {
        console.log('Error while saving', error)
        return false
        // Error saving data
    }
}

export const retrieveFromAsync = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // We have data!!
            return value;
        }
        return null;
    } catch (error) {
        console.log('Error while reading', error)
        return null
        // Error retrieving data
    }
};

export const clearFromAsync = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch (exception) {
        return false;
    }
}