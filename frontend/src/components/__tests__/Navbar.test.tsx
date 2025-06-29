import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'

jest.mock('@/contexts/AuthContext')
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    render(<Navbar />)

    expect(screen.getByText('HCTech Cars')).toBeInTheDocument()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Catálogo')).toBeInTheDocument()
    expect(screen.getByText('Entrar')).toBeInTheDocument()
    expect(screen.queryByText('Gestão')).not.toBeInTheDocument()
  })

  it('should render correctly when user is authenticated', () => {
    const mockUser = { id: 1, username: 'admin' }
    const mockLogout = jest.fn()

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: mockLogout,
    })

    render(<Navbar />)

    expect(screen.getByText('Gestão')).toBeInTheDocument()
    expect(screen.getByText('Olá, admin')).toBeInTheDocument()
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
  })

  it('should handle search form submission', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    const user = userEvent.setup()
    render(<Navbar />)

    const searchInput = screen.getByPlaceholderText('Buscar veículos...')
    const searchForm = searchInput.closest('form')

    await user.type(searchInput, 'Honda')
    fireEvent.submit(searchForm!)

    expect(mockPush).toHaveBeenCalledWith('/catalogo?q=Honda')
  })

  it('should clear search input after submission', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    const user = userEvent.setup()
    render(<Navbar />)

    const searchInput = screen.getByPlaceholderText('Buscar veículos...')
    const searchForm = searchInput.closest('form')

    await user.type(searchInput, 'Honda')
    fireEvent.submit(searchForm!)

    await waitFor(() => {
      expect(searchInput).toHaveValue('')
    })
  })

  it('should call logout when logout button is clicked', async () => {
    const mockUser = { id: 1, username: 'admin' }
    const mockLogout = jest.fn()

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: mockLogout,
    })

    const user = userEvent.setup()
    render(<Navbar />)

    const logoutButton = screen.getByText('Sair')
    await user.click(logoutButton)

    expect(mockLogout).toHaveBeenCalled()
  })
})
