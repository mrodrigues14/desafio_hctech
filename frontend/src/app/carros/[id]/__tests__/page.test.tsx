import { render, screen, waitFor } from '@testing-library/react'
import { useParams, useRouter } from 'next/navigation'
import CarDetailPage from '@/app/carros/[id]/page'
import { useAuth } from '@/contexts/AuthContext'
import { apiService } from '@/services/api'

jest.mock('next/navigation')
jest.mock('@/contexts/AuthContext')
jest.mock('@/services/api')

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockApiService = apiService as jest.Mocked<typeof apiService>

const mockPush = jest.fn()
const mockBack = jest.fn()

const mockCar = {
  id: 1,
  modelo: 'Civic',
  marca: 'Honda',
  imagemUrl: 'https://example.com/car.jpg',
  cor: 'Prata',
  valor: 120000,
}

describe('CarDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseParams.mockReturnValue({ id: '1' })
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: mockBack,
    } as any)
    
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    })
  })

  it('should render loading state initially', () => {
    mockApiService.getCarPublic.mockReturnValue(new Promise(() => {})) // Never resolves
    
    render(<CarDetailPage />)
    
    expect(screen.getByText('Carregando detalhes do carro...')).toBeInTheDocument()
  })

  it('should render car details when loaded successfully', async () => {
    mockApiService.getCarPublic.mockResolvedValue(mockCar)
    
    render(<CarDetailPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Honda Civic')).toBeInTheDocument()
    })
    
    expect(screen.getByText('R$ 120.000,00')).toBeInTheDocument()
    expect(screen.getByText('Honda')).toBeInTheDocument()
    expect(screen.getByText('Civic')).toBeInTheDocument()
    expect(screen.getByText('Prata')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('should render error state when API fails', async () => {
    const errorMessage = 'Erro ao carregar carro'
    mockApiService.getCarPublic.mockRejectedValue(new Error(errorMessage))
    
    render(<CarDetailPage />)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
    
    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument()
    expect(screen.getByText('Voltar ao Catálogo')).toBeInTheDocument()
  })

  it('should render not found state when API returns car not found', async () => {
    mockApiService.getCarPublic.mockRejectedValue(new Error('Carro não encontrado'))
    
    render(<CarDetailPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Carro não encontrado')).toBeInTheDocument()
    })
  })

  it('should handle invalid car ID', async () => {
    mockUseParams.mockReturnValue({ id: 'invalid' })
    
    render(<CarDetailPage />)
    
    await waitFor(() => {
      expect(screen.getByText('ID do carro inválido')).toBeInTheDocument()
    })
  })

  it('should handle array car ID by using first element', async () => {
    mockUseParams.mockReturnValue({ id: ['1', '2'] })
    mockApiService.getCarPublic.mockResolvedValue(mockCar)
    
    render(<CarDetailPage />)
    
    await waitFor(() => {
      expect(mockApiService.getCarPublic).toHaveBeenCalledWith(1)
    })
  })

  it('should call router.back when back button is clicked', async () => {
    mockApiService.getCarPublic.mockResolvedValue(mockCar)
    
    render(<CarDetailPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Honda Civic')).toBeInTheDocument()
    })
    
    const backButton = screen.getByText('← Voltar')
    backButton.click()
    
    expect(mockBack).toHaveBeenCalled()
  })

  it('should navigate to catalog when catalog button is clicked', async () => {
    mockApiService.getCarPublic.mockResolvedValue(mockCar)
    
    render(<CarDetailPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Honda Civic')).toBeInTheDocument()
    })
    
    const catalogButton = screen.getByText('Ver Catálogo Completo')
    catalogButton.click()
    
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('should format price correctly', async () => {
    const carWithDifferentPrice = {
      ...mockCar,
      valor: 85550.50
    }
    
    mockApiService.getCarPublic.mockResolvedValue(carWithDifferentPrice)
    
    render(<CarDetailPage />)
    
    await waitFor(() => {
      expect(screen.getByText('R$ 85.550,50')).toBeInTheDocument()
    })
  })

  it('should call API with correct car ID', async () => {
    mockUseParams.mockReturnValue({ id: '123' })
    mockApiService.getCarPublic.mockResolvedValue(mockCar)
    
    render(<CarDetailPage />)
    
    await waitFor(() => {
      expect(mockApiService.getCarPublic).toHaveBeenCalledWith(123)
    })
  })
})
