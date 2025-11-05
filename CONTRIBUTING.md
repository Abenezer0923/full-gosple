# Contributing to GraceLedger

## Development Workflow

### Branch Strategy

- `main`: Production branch
- `develop`: Staging/development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch from `develop`

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes
2. Write/update tests
3. Ensure tests pass: `npm test`
4. Commit with clear messages

```bash
git add .
git commit -m "feat: add member search functionality"
```

### Commit Message Format

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/config changes

### Pull Request Process

1. Push your branch to your fork
2. Create PR against `develop` branch
3. Ensure CI passes
4. Request review
5. Address feedback
6. Merge after approval

### Code Style

- Use ESLint configuration
- Follow existing patterns
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write tests for new features
- Maintain test coverage
- Test edge cases
- Run full test suite before PR

### Database Changes

1. Create Prisma migration
2. Test migration up and down
3. Update seed data if needed
4. Document schema changes

```bash
npx prisma migrate dev --name your_migration_name
```

## Questions?

Open an issue for discussion before major changes.
