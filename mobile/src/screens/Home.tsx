import { ScrollView, Text, View, Alert } from "react-native";
import { Header } from "../components/Header";
import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'

import { api } from '../lib/axios'
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates'
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateRangeDatesFromYearStart()
const minimumSummaryDatesSized = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSized - datesFromYearStart.length

type Summary = {
    id : string, 
    date : string,
    amount: number,
    completed:number
}[]

export function Home() {
    const [loading, setLoading] = useState<boolean>(true) 
    const [summary, setSummary] = useState<Summary>([])

    const {navigate} = useNavigation()

    async function fetchData() {
        try {
            setLoading(true)

            const response = await api.get('/summary')

            setSummary(response.data)

        } catch(error){
            Alert.alert("Ops" , "Não foi possivel carregar o sumário do hábito")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <Loading/>
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header/>

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => 
                        <Text className="text-zinc-500 text-xl font-bold text-center mx-1" 
                        style={{width: DAY_SIZE}}
                        key={i}>{weekDay}</Text>
                    )
                }
            </View>
            
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {
                    summary &&
                    <View className="flex-row flex-wrap">
                        {
                            datesFromYearStart.map((date) => {
                                
                                const dayInSummary = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })

                                return (
                                    <HabitDay 
                                        key={date.toISOString()}
                                        date={date}
                                        amount={dayInSummary?.amount}
                                        completed={dayInSummary?.completed}
                                        onPress={() => navigate('habit', {date: date.toISOString()})}
                                    />
                                )
                            })
                        }


                        {
                            amountOfDaysToFill > 0 && Array.from({length:amountOfDaysToFill})
                                .map( (_, i) =>
                                <View
                                    key={i}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{width: DAY_SIZE, height: DAY_SIZE}}
                                />
                            )
                        }

                    </View>
                }
            </ScrollView>

            
        </View>
    )
}