import '@testing-library/jest-dom'
import React from 'react'

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    }
  },
  useSearchParams() {
    return {
      get: jest.fn()
    }
  },
  useParams() {
    return {}
  },
  usePathname() {
    return ''
  }
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { alt, src, ...rest } = props
    return React.createElement('img', { alt, src, ...rest })
  },
}))

jest.mock('@/services/api', () => ({
  apiService: {
    getCarsPublic: jest.fn(),
    getCarPublic: jest.fn(),
    getCars: jest.fn(),
    getCar: jest.fn(),
    createCar: jest.fn(),
    updateCar: jest.fn(),
    deleteCar: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    getUsers: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
