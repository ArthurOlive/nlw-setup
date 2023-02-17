import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox';
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";


const avaliableWeekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sabado",
]

export function NewHabitForm() {

    const [title, setTitle] = useState<string>("")
    const [weekDays, setWeekDays] = useState<number[]>([])

    async function createNewHabit(event : FormEvent) {
        event.preventDefault()

        if (!title || weekDays.length == 0) {
            return
        }

        await api.post('habits', {
            title,
            weekDays
        })

        setTitle('')
        setWeekDays([])

        alert("Hábito criado com sucesso!")
    }

    function handleToggleWeekDay (weekDay : number) {
        console.log(weekDays)
        if (weekDays.includes(weekDay)) {
            setWeekDays(prev => prev.filter(wk => wk !== weekDay))
        } else {
            setWeekDays(prev => [...prev, weekDay])
        }
    }

    return (
        <form className="w-full flex flex-col mt-6" onSubmit={createNewHabit}>
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>

            <input type="text" id="title" placeholder="ex.: Exercicios, dormir bem, etc" 
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                onChange={event => setTitle(event.target.value)}
                value={title}
            autoFocus/>

            <label htmlFor="">
                Qual a recorrência?
            </label>

            <div className="mt-6 flex flex-col gap-3">
                {
                    avaliableWeekDays.map((dayWeek, index) => 
                            <Checkbox.Root
                                key={dayWeek}
                                className='flex items-center group'
                                checked={weekDays.includes(index)}
                                onCheckedChange={() => handleToggleWeekDay(index)}
                            >
                                <div 
                                    className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 
                                    group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors'
                                >
                                    <Checkbox.Indicator >
                                    <Check size={20} className='text-white'/>
                                    </Checkbox.Indicator>
                                </div>
                                <span className='font-semibold text-base text-white leading-tight ml-2'>
                                    {dayWeek}
                                </span>
                            </Checkbox.Root>
                        )
                    }

            </div>

            <button type="submit" 
            className="my-4 rounded-lg p-4 flex items-center  justify-center gap-3 font-semibold bg-green-400 hover:bg-green-500 transition-colors">
                <Check size={20} className="bold"/>
                Confirmar
            </button>
        </form>
    )
}