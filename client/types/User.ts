export interface SignupData {
  name: string
  email: string
  phone: string
  password: string
}

export interface LoginResponse {
  message: string
  token: string
  user: {
    id: number
    name: string
    email: string
  }
}