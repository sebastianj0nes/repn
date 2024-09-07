import { createContext } from 'react'

export const UserContext = createContext<{ session: any | null }>({ session: null })
