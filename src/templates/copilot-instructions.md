# GitHub Copilot Instructions

This file provides instructions for GitHub Copilot when working on this project.

## Project Context

Before generating code, always consider the project context:

### Core Information
- **Project Type**: Check `.ai/project.md` for project type and requirements
- **Technology Stack**: Review the tech stack and dependencies
- **Architecture**: Understand the system design from `.ai/architecture.md`
- **Patterns**: Follow coding patterns defined in `.ai/patterns.md`

### Current Work
- **Active Features**: Check `.ai/ledgers/_active.md` for current work
- **Feature Context**: Read specific feature ledgers for detailed requirements

## Code Generation Guidelines

### 1. Follow Project Patterns
- Use the naming conventions specified in `.ai/patterns.md`
- Follow the established file organization structure
- Implement error handling according to project patterns
- Use the preferred code style and formatting

### 2. Quality Standards
- Generate clean, readable code
- Include proper error handling
- Add meaningful comments for complex logic
- Write self-documenting code with descriptive names

### 3. Testing Considerations
- Generate test files alongside implementation code
- Include unit tests for new functions
- Consider edge cases and error conditions
- Follow the project's testing patterns

### 4. Security Best Practices
- Validate all user inputs
- Use parameterized queries for database operations
- Implement proper authentication checks
- Never include hardcoded secrets or credentials

## Framework-Specific Guidelines

### React Components
```javascript
// Preferred component structure
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = useCallback(() => {
    // handler logic
  }, [dependencies]);
  
  // Early returns for loading/error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  // Main render
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};
```

### API Functions
```javascript
// Preferred API function structure
export const apiFunction = async (params) => {
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    logger.error('API call failed:', error);
    throw error;
  }
};
```

### Database Operations
```javascript
// Preferred database operation structure
export const dbOperation = async (params) => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM table WHERE id = $1';
    const result = await client.query(query, [params.id]);
    return result.rows;
  } catch (error) {
    logger.error('Database operation failed:', error);
    throw error;
  } finally {
    client.release();
  }
};
```

## Documentation Generation

When generating code, also consider:

### JSDoc Comments
```javascript
/**
 * Brief description of the function
 * @param {string} param1 - Description of param1
 * @param {number} param2 - Description of param2
 * @returns {Promise<Object>} Description of return value
 * @throws {Error} When validation fails
 */
const functionName = async (param1, param2) => {
  // implementation
};
```

### README Sections
When generating README content:
- Include installation instructions
- Provide usage examples
- Document API endpoints
- Explain configuration options
- Add troubleshooting section

## Common Patterns to Use

### Error Handling
```javascript
// Consistent error handling pattern
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed:', error);
  return { 
    success: false, 
    error: { 
      code: 'OPERATION_FAILED',
      message: error.message 
    }
  };
}
```

### Configuration Management
```javascript
// Environment-based configuration
const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET
};
```

### Validation
```javascript
// Input validation pattern
const validateInput = (input) => {
  const errors = [];
  
  if (!input.email || !isValidEmail(input.email)) {
    errors.push('Valid email is required');
  }
  
  if (!input.password || input.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## Anti-Patterns to Avoid

- Don't generate large, monolithic functions
- Avoid deep nesting (prefer early returns)
- Don't use magic numbers or strings
- Avoid inconsistent naming conventions
- Don't skip error handling
- Avoid mixing concerns in single functions

## Context-Aware Suggestions

When suggesting code:

1. **Check existing patterns**: Look at similar code in the project
2. **Consider the feature**: Reference the relevant feature ledger
3. **Follow conventions**: Use established naming and structure patterns
4. **Include tests**: Suggest test cases for new functionality
5. **Update docs**: Remind about documentation updates

## Integration with Feature Ledgers

When working on a specific feature:
- Reference the feature ledger for requirements
- Update the ledger with implementation decisions
- Follow the technical approach outlined in the ledger
- Consider the success criteria when generating code

---

*These instructions help GitHub Copilot generate code that's consistent with the project's patterns and quality standards.*
