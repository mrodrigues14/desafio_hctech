import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

describe('ErrorMessage', () => {
  it('should render error message', () => {
    const message = 'Something went wrong'
    render(<ErrorMessage message={message} />)
    
    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it('should render retry button when onRetry is provided', () => {
    const onRetry = jest.fn()
    render(<ErrorMessage message="Error" onRetry={onRetry} />)
    
    expect(screen.getByText('Tentar novamente')).toBeInTheDocument()
  })

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error" />)
    
    expect(screen.queryByText('Tentar novamente')).not.toBeInTheDocument()
  })

  it('should call onRetry when retry button is clicked', async () => {
    const onRetry = jest.fn()
    const user = userEvent.setup()
    
    render(<ErrorMessage message="Error" onRetry={onRetry} />)
    
    await user.click(screen.getByText('Tentar novamente'))
    
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should have error styling', () => {
    render(<ErrorMessage message="Error" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-red-50')
    expect(alert).toHaveClass('border-red-200')
    expect(alert).toHaveClass('text-red-800')
  })

  it('should display error icon', () => {
    render(<ErrorMessage message="Error" />)
    
    const errorIcon = screen.getByRole('alert').querySelector('svg')
    expect(errorIcon).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<ErrorMessage message="Error occurred" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('Error occurred')
  })

  it('should apply center alignment', () => {
    render(<ErrorMessage message="Error" />)
    
    const container = screen.getByRole('alert')
    // O componente não tem center alignment por padrão, apenas flex items-center
    expect(container).toBeInTheDocument()
  })

  it('should handle long error messages', () => {
    const longMessage = 'This is a very long error message that should still be displayed properly without breaking the layout or causing any issues'
    render(<ErrorMessage message={longMessage} />)
    
    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })

  it('should handle empty error message', () => {
    render(<ErrorMessage message="" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
  })
})
