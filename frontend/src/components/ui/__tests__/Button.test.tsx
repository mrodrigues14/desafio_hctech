import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByText('Click me')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply primary variant styles by default', () => {
    render(<Button>Primary Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
    expect(button).toHaveClass('text-white')
  })

  it('should apply outline variant styles', () => {
    render(<Button variant="outline">Outline Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-gray-300')
    expect(button).toHaveClass('text-gray-700')
  })

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-600')
    expect(button).toHaveClass('text-white')
  })

  it('should apply danger variant styles', () => {
    render(<Button variant="danger">Danger Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-600')
    expect(button).toHaveClass('text-white')
  })

  it('should apply small size styles', () => {
    render(<Button size="sm">Small Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-3')
    expect(button).toHaveClass('py-1.5')
    expect(button).toHaveClass('text-sm')
  })

  it('should apply large size styles', () => {
    render(<Button size="lg">Large Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-6')
    expect(button).toHaveClass('py-3')
    expect(button).toHaveClass('text-lg')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50')
    expect(button).toHaveClass('cursor-not-allowed')
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>)
    
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should accept additional props', () => {
    render(<Button data-testid="test-button" type="submit">Submit Button</Button>)
    
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should show loading state when isLoading is true', () => {
    render(<Button isLoading>Loading Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.querySelector('svg')).toBeInTheDocument()
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should not show loading spinner when isLoading is false', () => {
    render(<Button isLoading={false}>Normal Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button.querySelector('svg')).not.toBeInTheDocument()
  })
})
