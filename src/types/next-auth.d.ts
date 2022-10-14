import { DefaultSession } from "next-auth"

// prettier-ignore
declare module "next-auth" { // eslint-disable-line
  interface Session {
    user: {
      id: string
    } & DefaultSession[`user`]
  }
}
