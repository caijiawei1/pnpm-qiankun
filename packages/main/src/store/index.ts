import { createContext, useContext } from 'react'
import { observer } from '@/utils/mobx'

const rootStore = {}

export { observer }
export const useStore = () => useContext(createContext(rootStore))
