# Wrinkl - AI Context Management System

A context management system for AI-assisted development. Track features with ledgers, maintain coding patterns, and keep AI assistants aligned with your project.

## Installation

```bash
npm install -g wrinkl
```

## Quick Start

```bash
# Initialize in your project
cd my-project
wrinkl init

# Create a feature ledger
wrinkl feature user-authentication

# List active features
wrinkl list

# Archive completed features
wrinkl archive user-authentication
```

## What It Does

Wrinkl creates a `.ai/` directory in your project with:

- **Context files** for AI assistants to understand your project
- **Pattern documentation** to maintain consistency
- **Feature ledgers** to track work progress
- **Architecture decisions** to guide development

## Why Use This?

- 🤖 **Better AI Assistance** - AI tools understand your project context
- 📝 **Feature Tracking** - Ledgers document progress and decisions
- 🎯 **Pattern Consistency** - Maintain coding standards across the team
- 🔄 **Living Documentation** - Context evolves with your project

## Directory Structure

After running `wrinkl init`, you'll have:

```
your-project/
├── .ai/
│   ├── README.md              # Overview of the AI context system
│   ├── project.md             # Project overview and requirements
│   ├── patterns.md            # Coding patterns and conventions
│   ├── architecture.md        # System architecture and decisions
│   ├── context-rules.md       # Rules for AI assistants
│   └── ledgers/
│       ├── _active.md         # Dashboard of active features
│       ├── _template.md       # Template for new feature ledgers
│       ├── archived/          # Completed feature ledgers
│       └── [feature-name].md  # Individual feature ledgers
├── .cursorrules               # Cursor AI rules (optional)
├── augment.md                 # Augment AI context (optional)
└── .github/
    └── copilot-instructions.md # GitHub Copilot instructions (optional)
```

## Commands

### `wrinkl init`

Initialize the AI context system in your project.

**Options:**
- `-n, --name <name>` - Project name (default: directory name)
- `-t, --type <type>` - Project type (default: "web app")
- `-s, --stack <stack>` - Technology stack (default: "TypeScript, Node.js")
- `--no-cursor` - Skip creating .cursorrules file
- `--with-augment` - Include augment.md file
- `--with-copilot` - Include GitHub Copilot instructions

**Example:**
```bash
wrinkl init --name "My App" --type "mobile app" --stack "React Native, Node.js"
```

### `wrinkl feature <name>`

Create a new feature ledger to track development progress.

**Options:**
- `-o, --owner <owner>` - Feature owner (default: "Pair")

**Example:**
```bash
wrinkl feature user-authentication --owner "Human"
```

### `wrinkl list`

List all active feature ledgers and their status.

**Options:**
- `-a, --all` - Include archived features

**Example:**
```bash
wrinkl list --all
```

### `wrinkl archive <name>`

Archive a completed feature ledger.

**Example:**
```bash
wrinkl archive user-authentication
```

## How It Works

### 1. Project Context
The `.ai/project.md` file contains your project's core information:
- Project goals and constraints
- Technology stack
- Key requirements
- Development workflow

### 2. Coding Patterns
The `.ai/patterns.md` file documents:
- Code style and conventions
- Common patterns and anti-patterns
- Testing strategies
- Performance guidelines

### 3. Architecture Decisions
The `.ai/architecture.md` file captures:
- System design decisions
- Technology choices and trade-offs
- Scalability considerations
- Security architecture

### 4. Feature Ledgers
Individual feature files track:
- Feature requirements and goals
- Technical approach and decisions
- Progress updates and blockers
- Testing and deployment notes

### 5. AI Assistant Rules
The `.ai/context-rules.md` file provides:
- Guidelines for AI assistants
- Code quality standards
- Security and performance rules
- Project-specific requirements

## Best Practices

### For Teams
1. **Keep context updated** - Regularly update project files as requirements change
2. **Use feature ledgers** - Create a ledger for each significant feature
3. **Document decisions** - Record important technical decisions in ledgers
4. **Review patterns** - Regularly review and update coding patterns

### For AI Assistance
1. **Reference context** - Tell AI assistants to read the `.ai/` directory
2. **Mention features** - Reference specific feature ledgers when working
3. **Update progress** - Keep ledgers updated with progress and decisions
4. **Follow patterns** - Ensure AI-generated code follows project patterns

### Example AI Prompts
```
"I'm working on the user-authentication feature. Please read the feature 
ledger in .ai/ledgers/user-authentication.md and help me implement the 
login component following the patterns in .ai/patterns.md"
```

```
"Please review the project context in .ai/project.md and suggest an 
architecture for the new notification system, documenting your decisions 
in a new feature ledger"
```

## Integration with AI Tools

### Cursor AI
If you use Cursor, the `.cursorrules` file provides context and guidelines for the AI assistant.

### Augment AI
The `augment.md` file provides context for Augment AI when working on your project.

### GitHub Copilot
The `.github/copilot-instructions.md` file guides GitHub Copilot to generate code that follows your project patterns.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT - see [LICENSE](LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/orangebread/wrinkl/issues)
- [Documentation](https://github.com/orangebread/wrinkl)

---

**Made with ❤️ for better AI-assisted development**
