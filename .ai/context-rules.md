# AI Context Rules

These rules guide AI assistants when working on this project.

## General Guidelines

### 1. Always Read Context First
- Review `project.md` to understand project goals and constraints
- Check `patterns.md` for coding conventions
- Read `architecture.md` for system design decisions
- Reference the relevant feature ledger when working on specific features

### 2. Follow Project Patterns
- Use the established coding patterns and conventions
- Maintain consistency with existing code style
- Follow the naming conventions specified in patterns.md
- Respect the project's architecture decisions

### 3. Feature Development Process
- Always check if a feature ledger exists for the work being done
- Update the feature ledger with progress and decisions
- Reference the ledger in commit messages and pull requests
- Move features through the proper status progression

## Code Quality Standards

### 4. Write Clean, Maintainable Code
- Functions should be small and focused (max 20-30 lines)
- Use descriptive variable and function names
- Add comments for complex business logic
- Write self-documenting code when possible

### 5. Testing Requirements
- Write unit tests for new functions and components
- Maintain or improve test coverage
- Test edge cases and error conditions
- Update integration tests when changing APIs

### 6. Error Handling
- Always handle errors gracefully
- Provide meaningful error messages to users
- Log errors appropriately for debugging
- Follow the project's error handling patterns

## Documentation Standards

### 7. Keep Documentation Updated
- Update relevant documentation when making changes
- Add JSDoc comments for new functions
- Update API documentation for endpoint changes
- Maintain README files for new modules

### 8. Feature Ledger Maintenance
- Update the feature ledger with:
  - Progress updates
  - Technical decisions made
  - Challenges encountered
  - Solutions implemented
  - Testing notes

## Security Guidelines

### 9. Security Best Practices
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Follow the principle of least privilege
- Never commit secrets or credentials

### 10. Data Protection
- Encrypt sensitive data
- Use HTTPS for all communications
- Implement proper session management
- Follow data privacy regulations (GDPR, CCPA, etc.)

## Performance Guidelines

### 11. Performance Considerations
- Optimize database queries
- Implement proper caching strategies
- Minimize bundle sizes for frontend code
- Use lazy loading where appropriate
- Monitor and profile performance regularly

### 12. Scalability Awareness
- Design for horizontal scaling
- Avoid tight coupling between components
- Use asynchronous processing for heavy operations
- Consider database performance implications

## Communication Guidelines

### 13. Clear Communication
- Write clear commit messages
- Provide detailed pull request descriptions
- Document decisions in feature ledgers
- Ask questions when requirements are unclear

### 14. Collaboration
- Review existing code before making changes
- Consider impact on other team members
- Follow the established code review process
- Share knowledge through documentation

## Specific Project Rules

### 15. Technology-Specific Guidelines
- [Add specific rules for your tech stack]
- [Framework-specific best practices]
- [Library usage guidelines]
- [Build tool configurations]

### 16. Business Logic Rules
- [Domain-specific rules]
- [Business constraint considerations]
- [Compliance requirements]
- [Integration requirements]

## Quality Checklist

Before submitting code, ensure:

- [ ] Code follows project patterns and conventions
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Feature ledger is updated (if applicable)
- [ ] Error handling is implemented
- [ ] Security considerations are addressed
- [ ] Performance impact is considered
- [ ] Code is reviewed for maintainability

## Common Mistakes to Avoid

### Anti-Patterns
- Don't ignore existing patterns and conventions
- Don't skip writing tests
- Don't commit code without proper error handling
- Don't make breaking changes without discussion
- Don't leave TODO comments without creating issues

### Technical Debt
- Address technical debt when encountered
- Refactor code that violates project patterns
- Update deprecated dependencies
- Remove unused code and dependencies

## Emergency Procedures

### Critical Issues
- For security vulnerabilities: [escalation process]
- For production outages: [incident response]
- For data loss scenarios: [recovery procedures]

## Resources

### Documentation
- [Link to project wiki]
- [API documentation]
- [Deployment guides]

### Tools
- [Development tools and setup]
- [Testing frameworks]
- [Monitoring and debugging tools]

## Updates

This document should be updated when:
- New patterns are established
- Architecture decisions change
- New tools or frameworks are adopted
- Team processes evolve

**Last Updated**: [DATE]  
**Next Review**: [DATE]
