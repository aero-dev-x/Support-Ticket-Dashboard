import { apiRequest } from './client'
import type { AuthResponse, User } from '../types/auth'

export function signup(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function fetchCurrentUser(): Promise<User> {
  return apiRequest<User>('/api/auth/me')
}
