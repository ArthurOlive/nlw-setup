import { ScrollView, Text, View, Alert } from "react-native";
import { useRoute } from '@react-navigation/native'
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";

import { useState, useEffect } from 'react'
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";

interface Params {
    date : string
}

interface HabitsInfo {
    possibleHabits: Array<{
      id : string,
      title: string,
      created_at: string,
    }>;
    completedHabits: string []
  }

export function Habit() {
    const [loading, setLoading] = useState(true)
    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

    const route = useRoute()
    const { date } = route.params as Params

    const endDay = dayjs(date).endOf('day').toISOString()
    const parsedDate = dayjs(date)
    const dayOfWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')

    const completedPercentage = habitsInfo && habitsInfo.possibleHabits.length > 0 ? Math.round((habitsInfo.completedHabits.length / habitsInfo.possibleHabits.length) * 100) : 0

    async function fetchHabit() {
        try {
            setLoading(true)

            const response = await api.get('/day', {
                params : {date : endDay}
            })

            setHabitsInfo(response.data)

        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possivel carregar as informações dos hábitos')
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleHabit(habitId : string) {

        await api.patch(`/habits/${habitId}/toggle`)
    
        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
    
        let completedHabits : string[] = []
    
        if (isHabitAlreadyCompleted) {
          completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
        } else {
          completedHabits = [...habitsInfo!.completedHabits, habitId]
        }
    
        setHabitsInfo({
          possibleHabits: habitsInfo!.possibleHabits,
          completedHabits
        })
    
      }

    useEffect(() => {
        fetchHabit()
    }, [])

    if (loading) {
        return <Loading/>
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton/>

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-semibold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={completedPercentage}/>

                <View className="mt-6">

                    {
                    habitsInfo && habitsInfo.possibleHabits.map((habit) => {
                        return (
                            <CheckBox
                                key={habit.id}
                                title={habit.title}
                                onPress={() => handleToggleHabit(habit.id)}
                                checked={habitsInfo.completedHabits.includes(habit.id)}
                            />
                        )
                    })
                    }

                </View>

            </ScrollView>
        </View>
    )
}