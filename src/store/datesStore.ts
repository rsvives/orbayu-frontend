import { addDays } from '@/lib/dates'
import { create } from 'zustand'

type Range = {
    day: 'day',
    week: 'week',
    range: 'range',
    month: 'month'
}

type State = {
    startDate: Date
    endDate: Date
    range: Range['day'] | Range['week'] | Range['range'] | Range['month']
}
type Actions = {
    setRange: (range: 'day' | 'week' | 'range' | 'month') => void
    setStartDate: (startDate: Date) => void
    setEndDate: (endDate: Date) => void
    updateEndDate: () => void
}

type DatesStore = State & Actions

export const useDatesStore = create<DatesStore>((set, get, store) => ({
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-15'),
    range: 'range',
    setRange: (range: 'day' | 'week' | 'range' | 'month') => set({ range }),
    setStartDate: (startDate: Date) => set({ startDate }),
    setEndDate: (endDate: Date) => set({ endDate }),
    updateEndDate: () => set({ endDate: addDays(get().startDate, store.getState().range) })
}))

