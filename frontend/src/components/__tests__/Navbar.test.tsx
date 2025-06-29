import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'

jest.mock('@/contexts/AuthContext')
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
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
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('should render correctly when admin user is authenticated', () => {
    const mockUser = { id: 1, username: 'admin', role: 'admin' as const }
    const mockLogout = jest.fn()

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: true,
      isLoading: false,
      login: jest.fn(),
      logout: mockLogout,
    })

    render(<Navbar />)

    expect(screen.getByText('HCTech Cars')).toBeInTheDocument()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Catálogo')).toBeInTheDocument()
    expect(screen.getByText('Gestão')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Olá, admin')).toBeInTheDocument()
    expect(screen.getByText('(Admin)')).toBeInTheDocument()
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
  })

  it('should render correctly when regular user is authenticated', () => {
    const mockUser = { id: 2, username: 'usuario', role: 'user' as const }
    const mockLogout = jest.fn()

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: false,
      isLoading: false,
      login: jest.fn(),
      logout: mockLogout,
    })

    render(<Navbar />)

    expect(screen.getByText('HCTech Cars')).toBeInTheDocument()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Catálogo')).toBeInTheDocument()
    expect(screen.getByText('Olá, usuario')).toBeInTheDocument()
    expect(screen.queryByText('(Admin)')).not.toBeInTheDocument()
    expect(screen.queryByText('Gestão')).not.toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
  })

  it('should call logout when logout button is clicked', async () => {
    const mockUser = { id: 1, username: 'admin', role: 'admin' as const }
    const mockLogout = jest.fn()

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: true,
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

  it('should render navigation links correctly', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    render(<Navbar />)

    const homeLink = screen.getByRole('link', { name: 'Início' })
    const catalogLink = screen.getByRole('link', { name: 'Catálogo' })
    const brandLink = screen.getByRole('link', { name: 'HCTech Cars' })

    expect(homeLink).toHaveAttribute('href', '/')
    expect(catalogLink).toHaveAttribute('href', '/catalogo')
    expect(brandLink).toHaveAttribute('href', '/')
  })

  it('should render admin navigation links when user is admin', () => {
    const mockUser = { id: 1, username: 'admin', role: 'admin' as const }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    render(<Navbar />)

    const gestaoLink = screen.getByRole('link', { name: 'Gestão' })
    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })

    expect(gestaoLink).toHaveAttribute('href', '/gestao')
    expect(dashboardLink).toHaveAttribute('href', '/gestao/dashboard')
  })

  it('should render login button with correct link when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    render(<Navbar />)

    const loginLink = screen.getByRole('link', { name: 'Entrar' })
    expect(loginLink).toHaveAttribute('href', '/login')
  })
})
