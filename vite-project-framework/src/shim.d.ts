import { AttributifyAttributes } from 'windicss/types/jsx'

declare module 'react' {
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}