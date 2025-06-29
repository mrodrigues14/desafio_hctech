import { render, screen } from '@testing-library/react'
import { Loading } from '@/components/ui/Loading'

describe('Loading', () => {
  it('should render loading spinner', () => {
    render(<Loading />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should render custom text', () => {
    const customText = 'Loading custom data...'
    render(<Loading text={customText} />)
    
    expect(screen.getByText(customText)).toBeInTheDocument()
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument()
  })

  it('should apply small size styles', () => {
    render(<Loading size="sm" />)
    
    const spinner = screen.getByRole('status').querySelector('svg')
    expect(spinner).toHaveClass('h-4')
    expect(spinner).toHaveClass('w-4')
  })

  it('should apply medium size styles by default', () => {
    render(<Loading />)
    
    const spinner = screen.getByRole('status').querySelector('svg')
    expect(spinner).toHaveClass('h-8')
    expect(spinner).toHaveClass('w-8')
  })

  it('should apply large size styles', () => {
    render(<Loading size="lg" />)
    
    const spinner = screen.getByRole('status').querySelector('svg')
    expect(spinner).toHaveClass('h-12')
    expect(spinner).toHaveClass('w-12')
  })

  it('should have accessibility attributes', () => {
    render(<Loading />)
    
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-label', 'Carregando')
  })

  it('should apply custom aria-label when custom text is provided', () => {
    const customText = 'Loading data'
    render(<Loading text={customText} />)
    
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-label', customText)
  })

  it('should have spinning animation', () => {
    render(<Loading />)
    
    const spinner = screen.getByRole('status').querySelector('svg')
    expect(spinner).toHaveClass('animate-spin')
  })

  it('should apply center alignment by default', () => {
    render(<Loading />)
    
    const container = screen.getByRole('status')
    expect(container).toHaveClass('flex')
    expect(container).toHaveClass('items-center')
    expect(container).toHaveClass('justify-center')
  })
})
