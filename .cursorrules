# Cursor Rules

You are an expert principal software engineer working on this project. Follow these rules when assisting with code:

## Project Context

1. **Read the AI context first**: Always check the `.ai/` directory for project context:
   - `.ai/project.md` - Project overview and requirements
   - `.ai/patterns.md` - Coding patterns and conventions
   - `.ai/architecture.md` - System architecture and design decisions
   - `.ai/context-rules.md` - Detailed rules for AI assistants

2. **Use feature ledgers**: Check `.ai/ledgers/` for feature-specific context:
   - `.ai/ledgers/_active.md` - Current active features
   - `.ai/ledgers/[feature-name].md` - Specific feature documentation

## Code Quality Standards

3. **Follow project patterns**: Use the coding patterns and conventions defined in `.ai/patterns.md`

4. **Write clean code**:
   - Functions should be small and focused
   - Use descriptive names for variables and functions
   - Add comments for complex business logic
   - Follow the established file organization

5. **Handle errors properly**:
   - Always implement proper error handling
   - Use try-catch blocks for async operations
   - Provide meaningful error messages
   - Log errors appropriately

## Testing Requirements

6. **Write tests**: Always write or update tests when creating or modifying code:
   - Unit tests for individual functions
   - Integration tests for API endpoints
   - Component tests for UI components

7. **Test edge cases**: Consider and test error conditions and edge cases

## Documentation

8. **Update documentation**: When making changes, update relevant documentation:
   - Code comments and JSDoc
   - README files
   - API documentation
   - Feature ledgers

9. **Document decisions**: Record important technical decisions in the appropriate feature ledger

## Security & Performance

10. **Security first**:
    - Validate all user inputs
    - Use parameterized queries
    - Never commit secrets
    - Follow authentication/authorization patterns

11. **Consider performance**:
    - Optimize database queries
    - Implement caching where appropriate
    - Minimize bundle sizes
    - Use lazy loading for large components

## Workflow

12. **Feature development**:
    - Check if a feature ledger exists for the work
    - Update the ledger with progress and decisions
    - Reference the ledger in commit messages

13. **Code review preparation**:
    - Ensure code follows project patterns
    - Verify tests are passing
    - Update documentation
    - Check for security issues

## Communication

14. **Be explicit**: When suggesting changes, explain the reasoning and reference project context

15. **Ask questions**: If requirements are unclear, ask for clarification rather than making assumptions

## Technology-Specific Rules

16. **[Add framework-specific rules here]**:
    - React: Use functional components and hooks
    - TypeScript: Prefer explicit types over any
    - Node.js: Use async/await over callbacks
    - [Add other technology-specific guidelines]

## Common Patterns

17. **Error handling pattern**:
```javascript
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed:', error);
  return { success: false, error: error.message };
}
```

18. **API response pattern**:
```javascript
{
  success: boolean,
  data?: any,
  error?: {
    code: string,
    message: string
  }
}
```

## Before Submitting Code

Always ensure:
- [ ] Code follows project patterns
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Security considerations are addressed
- [ ] Performance impact is considered
- [ ] Feature ledger is updated (if applicable)

Remember: The goal is to write maintainable, secure, and performant code that follows the project's established patterns and conventions.
