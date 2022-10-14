import { makeVar } from "@apollo/client"

export const loadingVar = makeVar(0)
export const toastsVar = makeVar([])