// Importamos las utilidades de testing
import '@testing-library/jest-dom';

// Esta configuración permite que los tests tengan acceso a todas las utilidades
// de jest-dom, como toBeInTheDocument(), toHaveTextContent(), etc.

// Si necesitas configuraciones adicionales para tus tests, puedes añadirlas aquí.
// Por ejemplo, si usas fetch en tus componentes, podrías configurar un mock global:
// global.fetch = vi.fn();

// También puedes configurar mocks para módulos específicos
// vi.mock('nombre-del-modulo', () => ({ ... }));
