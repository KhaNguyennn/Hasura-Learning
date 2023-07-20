type Maybe<T> = T | null





type SignupCredentials = {
  id?: Maybe<number>
  username: string
  password: string
}

type UserCredential = {
  id: number
  username: string
  password: string
}

type Mutation = {
  create_user?: Maybe<UserCredential>
}

type create_userArgs = {
  credentials: SignupCredentials
}