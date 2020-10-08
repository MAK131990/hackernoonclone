import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions
} from 'react-native';

import { getFrontPageStories } from '../api'
import Item from './item'
import Header from './header'
import { saveToAsync, retrieveFromAsync, clearFromAsync } from '../utils'

export default function HomePage() {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0)
    const [isExhausted, setExhausted] = useState(false)
    const [toShowNext, setShowNext] = useState(true)
    const [height, setHeight] = useState(0)

    const readFromStore = async (key) => {
        let val = await retrieveFromAsync(key);
        console.log("reading from store", JSON.parse(val));
        return JSON.parse(val);
    }

    const addMoreHits = async () => {
        const pageNum = await readFromStore('@pageNum');
        const frontPageData = await getFrontPageStories(pageNum + 1);
        const savedData = await readFromStore('@hits');
        if (frontPageData.hits && frontPageData.hits.length > 0) {
            let tempArr = (frontPageData.hits.map(item => {
                return { ...item, upvote: 0, hidden: false }
            }))
            await saveToAsync('@hits', JSON.stringify([...savedData, ...tempArr]))
            await saveToAsync('@pageNum', `${pageNum + 1}`);
            await saveToAsync('@exhaustiveNbHits', `${frontPageData.nbHits == savedData.length + tempArr.length}`)
            setExhausted(frontPageData.nbHits <= savedData.length + tempArr.length)
        } else if (frontPageData.hits && frontPageData.hits.length == 0) {
            await saveToAsync('@pageNum', `${pageNum + 1}`);
            await saveToAsync('@exhaustiveNbHits', `${true}`)
            setExhausted(true)
        }
    }

    const getPageData = async () => {
        const savedData = await readFromStore('@hits');
        let frontPageData;
        if(!savedData){
            frontPageData = await getFrontPageStories(0);
            if (frontPageData.hits && frontPageData.hits.length > 0) {
                let tempArr = (frontPageData.hits.map(item => {
                    return { ...item, upvote: 0, hidden: false }
                }))
                setPageData(tempArr)
                await saveToAsync('@hits', JSON.stringify([...tempArr]))
                await saveToAsync('@pageNum', '0');
                await saveToAsync('@exhaustiveNbHits', `${frontPageData.nbHits == frontPageData.hits.length}`)
                setExhausted(frontPageData.nbHits == frontPageData.hits.length)
            } else if (frontPageData.hits && frontPageData.hits.length == 0) {
                await saveToAsync('@pageNum', '0');
                await saveToAsync('@exhaustiveNbHits', `${true}`)
                setExhausted(true)
            }
        }else{
            frontPageData = savedData.filter(x=>!x.hidden)
            if(frontPageData.length<20){
                await addMoreHits();
            }
            const savedNewData = await readFromStore('@hits')
            let dataToShow = savedNewData.filter(x => !x.hidden).slice(0, 20);
            setPageData(dataToShow);
        }

        const { height } = Dimensions.get('window'); // if you use the width you can get the screen width by pixels. And also height is the height pixels of the phone. 
        let temp = height - height % 100
        setHeight(temp);
    }

    const upvoteAdd1 = async (id) => {
        let tempData = (pageData.map(item => {
            if (id == item.objectID) {
                return ({ ...item, upvote: item.upvote + 1 })
            }
            return ({ ...item })
        }))
        setPageData(tempData);
        const savedData = await readFromStore('@hits')
        let tempData2 = (savedData.map(item => {
            if (id == item.objectID) {
                return ({ ...item, upvote: item.upvote + 1 })
            }
            return ({ ...item })
        }))
        await saveToAsync('@hits', JSON.stringify([...tempData2]))
    };

    const hideById = async (id) => {
        let tempData = (pageData.map(item => {
            if (id == item.objectID) {
                return ({ ...item, hidden: true })
            }
            return ({ ...item })
        }))
        setPageData(tempData);

        const savedData = await readFromStore('@hits')
        let tempData2 = (savedData.map(item => {
            if (id == item.objectID) {
                return ({ ...item, hidden: true })
            }
            return ({ ...item })
        }))
        await saveToAsync('@hits', JSON.stringify([...tempData2]))
        let dataToShow = tempData2.filter(x => !x.hidden).slice(currentPage * 20, currentPage * 20 + 20);

        if (dataToShow.length < 20) {
            await addMoreHits();
            const savedNewData = await readFromStore('@hits')
            dataToShow = savedNewData.filter(x => !x.hidden).slice(currentPage * 20, currentPage * 20 + 20)
            setPageData(dataToShow);
        } else {
            setPageData(dataToShow);
        }
        if (dataToShow.length < 20) {
            setShowNext(false);
        }
    }

    const nextPress = async () => {
        let crPage = currentPage + 1
        const exhausted = await readFromStore('@exhaustiveNbHits');
        if (!exhausted) {
            await addMoreHits()
        }
        const savedData = await readFromStore('@hits')
        let dataToShow = savedData.filter(x => !x.hidden).slice(crPage * 20, crPage * 20 + 20)
        if (dataToShow.length > 0) {
            setPageData(dataToShow);
            setCurrentPage(currentPage + 1);
            if(dataToShow.length<20){
                setExhausted(true);
            }
        }
        setShowNext(false);
    }

    const backPress = async () => {
        let crPage = currentPage - 1
        setCurrentPage(currentPage - 1);
        const savedData = await readFromStore('@hits')
        let dataToShow = savedData.filter(x => !x.hidden).slice(crPage * 20, crPage * 20 + 20)
        setPageData(dataToShow);
        setShowNext(true);
    }

    const clearStorage = async () => {
        await readFromStore('@hits');
        const val = await clearFromAsync('@hits');
        console.log(val);

    }

    useEffect(() => {
        getPageData();
    }, [])

    if (!pageData) {
        return <Text>Loading....</Text>
    } else if (!pageData || pageData.length == 0) {
        return <Text>No result.</Text>
    }
    console.log(pageData);
    return (
        <View style={{ display: 'flex' }}>
            <Header
                title={'HackerNoon'}
                showBack={currentPage > 0}
                showNext={!isExhausted || toShowNext}
                nextPress={nextPress}
                backPress={backPress}
                clearStorage={clearStorage}
            />
            <View style={{paddingBottom:30, height:height}}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                >
                    <View style={{ backgroundColor: '#F6F6F0' }}>
                        {
                            pageData.filter(x => !x.hidden).map((item, idx) => {
                                return <Item
                                    key={`${item.objectID}_${item.url}_${JSON.stringify(item)}`}
                                    title={item.title}
                                    number={idx + 1}
                                    author={item.author}
                                    points={item.points}
                                    url={item.url}
                                    createdTime={item.created_at}
                                    upvoteAdd1={upvoteAdd1}
                                    hideById={hideById}
                                    id={item.objectID}
                                    upvote={item.upvote}
                                />
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}