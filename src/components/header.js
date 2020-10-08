import React, { useEffect, useState } from 'react';
import {
    View,
    Text, TouchableOpacity
} from 'react-native';

export default function Header({ title, backPress, nextPress, showBack, showNext, clearStorage }) {
    return <View style={{ height: 30, backgroundColor: '#FF6601', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
            {(showBack) && <TouchableOpacity onPress={() => { console.log('back pressed'); backPress(); }}>
                <Text>&#9664; Back</Text>
            </TouchableOpacity>}
        </View>
        <Text>{title}</Text>
        {/* <TouchableOpacity onPress={() => { clearStorage(); }}>
            <Text>Clear</Text>
        </TouchableOpacity> */}
        <View>
            {(showNext) && <TouchableOpacity onPress={() => { console.log('Next pressed'); nextPress(); }}>
                <Text>Next &#9654;</Text>
            </TouchableOpacity>}
        </View>
    </View>
}