import React, { useEffect, useState } from 'react';
import {
    View,
    Text, TouchableOpacity
} from 'react-native';

import { timeAgo } from '../utils'

export default function Item({ number, title, author, points, url, createdTime,
    upvoteAdd1, hideById, id, upvote }) {
    let tempArrForUrl = url?.split('//');
    let tempNewUrl = tempArrForUrl ? (tempArrForUrl.length > 1 ? tempArrForUrl[1] : tempArrForUrl[0]) : null
    const urlToShow = tempNewUrl?.split('/')[0]

    let momentAgo = createdTime ? timeAgo(createdTime) : null;
    return (
        <View style={{ display: 'flex', margin: 5, flexDirection: 'row' }}>
            <Text style={{ color: '#828282' }}>{number}</Text>

            <View style={{ marginLeft: 5 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={() => { upvoteAdd1(id) }}>
                        <Text style={{ marginRight: 2, fontSize: 15, color: 'grey', width: 15 }}>&#9650;</Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', marginRight: 5 }}>
                        {title.trim()} &nbsp;
                        {Boolean(urlToShow) && <Text style={{ color: 'grey', fontWeight: 'normal' }}>{`(${urlToShow})`}</Text>}
                    </Text>
                </View>
                <View style={{ marginLeft: 15, display: 'flex', flexDirection: 'row' }}>
                    <Text style={{ fontSize: 10 }}>{points} points by {author} {momentAgo} | </Text>
                    <TouchableOpacity onPress={() => { hideById(id) }}>
                        <Text style={{ fontSize: 10 }}>Hide</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 10 }}> | {upvote} upvotes</Text>
                </View>
            </View>
        </View>
    )
}