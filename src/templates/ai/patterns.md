# Coding Patterns & Conventions

This document outlines the coding patterns, conventions, and best practices for this project.

## Code Style

### General Principles
- Write self-documenting code
- Prefer explicit over implicit
- Keep functions small and focused
- Use meaningful names for variables and functions

### Naming Conventions
- **Variables**: camelCase
- **Functions**: camelCase
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: kebab-case.js

### File Organization
```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── utils/         # Utility functions
├── hooks/         # Custom hooks (React)
├── services/      # API and external service calls
├── types/         # Type definitions
└── constants/     # Application constants
```

## Component Patterns

### React Components (if applicable)
```javascript
// Preferred component structure
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {
    // handler logic
  };
  
  // Early returns for loading/error states
  if (loading) return <Loading />;
  
  // Main render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};
```

### Error Handling
```javascript
// Preferred error handling pattern
try {
  const result = await apiCall();
  return result;
} catch (error) {
  logger.error('Operation failed:', error);
  throw new CustomError('User-friendly message');
}
```

## API Patterns

### Request/Response Structure
```javascript
// API response format
{
  success: boolean,
  data: any,
  error?: {
    code: string,
    message: string
  }
}
```

### Service Layer Pattern
```javascript
// Service function structure
export const userService = {
  async getUser(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }
};
```

## Testing Patterns

### Unit Tests
- Test one thing at a time
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```javascript
describe('UserService', () => {
  it('should return user data when valid ID is provided', async () => {
    // Arrange
    const userId = '123';
    const expectedUser = { id: '123', name: 'John' };
    
    // Act
    const result = await userService.getUser(userId);
    
    // Assert
    expect(result).toEqual(expectedUser);
  });
});
```

## Common Anti-Patterns to Avoid

- ❌ Large, monolithic functions
- ❌ Deep nesting (prefer early returns)
- ❌ Magic numbers and strings
- ❌ Inconsistent naming
- ❌ Mixing concerns in a single function
- ❌ Not handling errors properly

## Performance Patterns

### Optimization Guidelines
- Lazy load components and routes
- Memoize expensive calculations
- Debounce user input
- Use proper caching strategies
- Optimize bundle size

### Example: Memoization
```javascript
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});
```

## Security Patterns

- Always validate input
- Sanitize user data
- Use HTTPS for all communications
- Implement proper authentication
- Follow principle of least privilege

## Documentation Patterns

### Function Documentation
```javascript
/**
 * Calculates the total price including tax
 * @param {number} basePrice - The base price before tax
 * @param {number} taxRate - The tax rate (e.g., 0.08 for 8%)
 * @returns {number} The total price including tax
 */
const calculateTotalPrice = (basePrice, taxRate) => {
  return basePrice * (1 + taxRate);
};
```

## Notes

- Update this document as new patterns emerge
- Discuss pattern changes with the team
- Reference this document in code reviews
