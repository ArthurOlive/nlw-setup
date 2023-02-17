import clsx from "clsx";
import dayjs from "dayjs";
import { Dimensions, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGING_BETWEEN = 8
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)

interface Props extends TouchableOpacityProps {
    amount?: number;
    completed?: number;
    date : Date;
}

export function HabitDay({amount = 0, completed = 0, date, ...rest} : Props) {

    const completedPercentage = amount > 0 ? Math.round(completed / amount * 100) : 0

    const today = dayjs().startOf('day').toDate()
    const isCurrentDay = dayjs(date).isSame(today)
  
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className={clsx('border-2 rounded-lg m-1', {
                'bg-zinc-900 border-zinc-800': completedPercentage === 0,
                'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 20,
                'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
                'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
                'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
                'bg-violet-500 border-violet-400': completedPercentage >= 80,
                'border-white border-4' : isCurrentDay
            })}
            style={{width: DAY_SIZE, height: DAY_SIZE}}
            {...rest}
        />
    )
}