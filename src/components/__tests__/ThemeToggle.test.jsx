import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToogle';

// Mock para sessionStorage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: () => {
      store = {};
    }
  };
})();

// Mock para matchMedia
const mockMatchMedia = (matches) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('ThemeToggle', () => {
  // Antes de cada test, limpiamos los mocks
  beforeEach(() => {
    // Restauramos los mocks
    vi.clearAllMocks();
    
    // Configuramos los mocks para sessionStorage
    Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });
    mockSessionStorage.clear();
    
    // Mock para document.documentElement.classList.toggle
    // En lugar de redefinir classList, hacemos un mock de su método toggle
    if (!document.documentElement.classList.toggle.mock) {
      document.documentElement.classList.toggle = vi.fn();
    }
    
    // Por defecto, simulamos que el sistema está en modo claro
    mockMatchMedia(false);
  });

  it('debería renderizar correctamente con tema claro por defecto', () => {
    // Simulamos que no hay tema guardado en sessionStorage y el sistema está en modo claro
    mockSessionStorage.getItem.mockReturnValueOnce(null);
    mockMatchMedia(false);
    
    // Renderizamos el componente con un mock para closeMobileNav
    const closeMobileNav = vi.fn();
    render(<ThemeToggle closeMobileNav={closeMobileNav} />);
    
    // Verificamos que el botón existe
    const button = screen.getByRole('button', { name: /cambiar tema/i });
    expect(button).toBeInTheDocument();
    
    // Verificamos que el icono de luna (modo claro) está presente
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('debería cambiar de tema claro a oscuro al hacer clic', () => {
    // Configuramos el tema inicial como claro
    mockSessionStorage.getItem.mockReturnValueOnce('light');
    
    // Renderizamos el componente con un mock para closeMobileNav
    const closeMobileNav = vi.fn();
    render(<ThemeToggle closeMobileNav={closeMobileNav} />);
    
    // Obtenemos el botón
    const button = screen.getByRole('button', { name: /cambiar tema/i });
    
    // Hacemos clic en el botón
    fireEvent.click(button);
    
    // Verificamos que se llamó a toggle con 'dark'
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
    
    // Verificamos que se guardó el tema en sessionStorage
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    
    // Verificamos que se llamó a closeMobileNav
    expect(closeMobileNav).toHaveBeenCalled();
  });

  it('debería cambiar de tema oscuro a claro al hacer clic', () => {
    // Configuramos el tema inicial como oscuro
    mockSessionStorage.getItem.mockReturnValueOnce('dark');
    
    // Renderizamos el componente con un mock para closeMobileNav
    const closeMobileNav = vi.fn();
    render(<ThemeToggle closeMobileNav={closeMobileNav} />);
    
    // Obtenemos el botón
    const button = screen.getByRole('button', { name: /cambiar tema/i });
    
    // Hacemos clic en el botón
    fireEvent.click(button);
    
    // Verificamos que se llamó a toggle con 'light'
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
    
    // Verificamos que se guardó el tema en sessionStorage
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    
    // Verificamos que se llamó a closeMobileNav
    expect(closeMobileNav).toHaveBeenCalled();
  });

  it('debería usar el tema del sistema cuando no hay tema guardado', () => {
    // Simulamos que no hay tema guardado y el sistema está en modo oscuro
    mockSessionStorage.getItem.mockReturnValueOnce(null);
    mockMatchMedia(true); // true = modo oscuro
    
    // Renderizamos el componente
    render(<ThemeToggle closeMobileNav={vi.fn()} />);
    
    // Verificamos que se aplicó el tema oscuro
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });
});
