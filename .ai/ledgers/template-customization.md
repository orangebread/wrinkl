# Template Customization

**Branch:** feat/template-customization
**Summary:** Allow users to customize and extend Wrinkl templates for their specific project needs and organizational standards.
**Status:** Planning
**Created:** 2025-06-25
**Updated:** 2025-06-25

## Context

### Problem Statement
Currently, Wrinkl uses fixed templates for AI context files and feature ledgers. Different organizations and project types need customized templates that reflect their specific workflows, documentation standards, and AI assistant preferences. Users should be able to modify existing templates or create entirely new ones.

### Success Criteria
- [ ] Users can override default templates with custom ones
- [ ] Template discovery works from multiple locations (global, project-local)
- [ ] Custom templates support the same variable substitution as built-in templates
- [ ] Template validation ensures required sections are present
- [ ] Documentation explains template customization process

### Acceptance Criteria
- [ ] User can place custom templates in `.wrinkl/templates/` directory
- [ ] Custom templates take precedence over built-in templates
- [ ] `wrinkl init --template custom-web-app` uses custom template set
- [ ] Template validation provides helpful error messages
- [ ] Custom variables can be defined and used in templates

## Technical Approach

### Architecture Changes
- Extend template discovery to check multiple locations in priority order
- Add template validation system to ensure required sections exist
- Implement custom variable system for template substitution
- Create template inheritance system for extending base templates

### Implementation Plan
1. **Template Discovery System**: Modify `getTemplatesDir()` to check multiple locations
2. **Template Validation**: Create validation schema for required template sections
3. **Custom Variables**: Extend variable substitution to support user-defined variables
4. **CLI Integration**: Add template options to `wrinkl init` command
5. **Documentation**: Create template customization guide with examples

### Dependencies
- JSON Schema or similar for template validation
- Enhanced configuration system for custom variables
- File system utilities for template discovery

### Risks & Mitigations
- **Risk 1**: Template validation complexity could slow down operations
  - *Mitigation*: Cache validation results and use lazy validation
- **Risk 2**: Custom templates might break with Wrinkl updates
  - *Mitigation*: Version template schemas and provide migration guides

## Progress Log

### 2025-06-25 - Initial Planning
- Created feature ledger
- Defined requirements and success criteria
- Outlined technical approach
- Identified template discovery and validation as key components

## Technical Decisions

### Decision 1: Template Discovery Priority
**Context**: Need to determine order of template resolution  
**Options**: Global first vs project-local first vs explicit configuration  
**Decision**: Project-local → Global → Built-in (highest to lowest priority)  
**Reasoning**: Allows project-specific overrides while maintaining fallbacks  
**Consequences**: Clear precedence rules, easy to understand and debug

### Decision 2: Template Validation Approach
**Context**: Need to validate custom templates without being overly restrictive  
**Options**: Strict schema validation vs loose validation vs no validation  
**Decision**: Loose validation with warnings for missing recommended sections  
**Reasoning**: Balances safety with flexibility for diverse use cases  
**Consequences**: Users get guidance but aren't blocked by strict requirements

## Testing Strategy

### Unit Tests
- [ ] Template discovery finds templates in correct priority order
- [ ] Variable substitution works with custom variables
- [ ] Template validation identifies missing required sections
- [ ] Error handling for malformed templates

### Integration Tests
- [ ] `wrinkl init` with custom template creates correct file structure
- [ ] Custom templates work with all existing commands
- [ ] Template inheritance resolves variables correctly

### Manual Testing
- [ ] Create custom template set and verify it works end-to-end
- [ ] Test template validation with various invalid templates
- [ ] Verify error messages are helpful and actionable

## Documentation Updates

- [ ] Template customization guide in README
- [ ] Template schema documentation
- [ ] Example custom templates for different project types
- [ ] Migration guide for template format changes

## Deployment Notes

### Environment Requirements
- No new environment variables required
- Template directories created automatically if they don't exist
- Backward compatibility maintained with existing installations

### Rollback Plan
Steps to rollback if issues are discovered:
1. Revert template discovery changes
2. Fall back to built-in templates only
3. Remove custom template validation

## Review & Feedback

### Code Review Checklist
- [ ] Template discovery logic is efficient and well-tested
- [ ] Variable substitution handles edge cases properly
- [ ] Error messages are clear and actionable
- [ ] Documentation covers all customization scenarios
- [ ] Backward compatibility is maintained

### Stakeholder Feedback
- Need examples for common project types (React, Vue, Python, etc.)
- Template validation should be helpful, not restrictive
- Consider template sharing/marketplace in future

## Completion

### Final Status
- [ ] All acceptance criteria met
- [ ] Tests passing with good coverage
- [ ] Documentation updated and reviewed
- [ ] Code reviewed and approved
- [ ] Feature tested with real custom templates

### Lessons Learned
- Template flexibility vs validation is a key balance
- Clear precedence rules prevent user confusion
- Good error messages are crucial for template debugging

### Follow-up Items
- [ ] Create template gallery with community examples
- [ ] Consider template versioning for future compatibility
- [ ] Explore template marketplace or sharing system

---

*This ledger tracks the development of template customization. Update it regularly with progress, decisions, and learnings.*
