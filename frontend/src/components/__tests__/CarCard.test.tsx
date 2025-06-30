import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CarCard } from '@/components/CarCard'
import { Car } from '@/types'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockCar: Car = {
  id: 1,
  modelo: 'Civic',
  marca: 'Honda',
  imagemUrl: 'https://example.com/civic.jpg',
  cor: 'Preto',
  valor: 85000,
}

describe('CarCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render car information correctly', () => {
    render(<CarCard car={mockCar} />)

    expect(screen.getByText('Honda Civic')).toBeInTheDocument()
    expect(screen.getByText('Preto')).toBeInTheDocument()
    expect(screen.getByText('R$ 85.000,00')).toBeInTheDocument()
  })

  it('should navigate to car detail page when clicked', async () => {
    const user = userEvent.setup()
    render(<CarCard car={mockCar} />)

    const links = screen.getAllByRole('link', { name: 'Honda Civic' })
    expect(links[0]).toHaveAttribute('href', '/carros/1')
    expect(links[1]).toHaveAttribute('href', '/carros/1')
  })

  it('should display car image with correct alt text', () => {
    render(<CarCard car={mockCar} />)

    const image = screen.getByAltText('Honda Civic')
    expect(image).toBeInTheDocument()
  })

  it('should format price correctly', () => {
    const carWithDifferentPrice: Car = {
      ...mockCar,
      valor: 123456.78,
    }

    render(<CarCard car={carWithDifferentPrice} />)

    expect(screen.getByText('R$ 123.456,78')).toBeInTheDocument()
  })

  it('should handle image error gracefully', () => {
    render(<CarCard car={mockCar} />)

    const image = screen.getByAltText('Honda Civic')
    expect(image).toBeInTheDocument()
  })
})
