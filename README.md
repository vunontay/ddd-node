# create-ddd-app

[![npm version](https://badge.fury.io/js/create-ddd-app.svg)](https://www.npmjs.com/package/create-ddd-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful CLI tool to scaffold Node.js projects with Domain-Driven Design (DDD) architecture structure. Inspired by hmvc-rails, this tool provides an easy way to generate DDD modules with a Rails-like developer experience.

## 🚀 Features

- **Quick Project Scaffolding**: Generate a complete DDD project structure in seconds
- **HMVC-style Module Generation**: Generate DDD modules like hmvc-rails
- **Domain-Driven Design Structure**: Follows DDD architectural patterns
- **TypeScript Ready**: Built with TypeScript support out of the box
- **Flexible Options**: Customize generated modules with various options
- **File Tracing**: Automatically adds creator info and timestamps

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g create-ddd-app
```

### Using npx (No Installation Required)

```bash
npx create-ddd-app new my-project
```

## 🎯 Usage

### Create a New DDD Project

```bash
create-ddd-app new <project-name>
```

**Example:**
```bash
create-ddd-app new my-awesome-api
```

### Generate DDD Modules (HMVC-style)

#### Default Generator

```bash
create-ddd-app generate <module-name>
# or short command
create-ddd-app g <module-name>
```

#### Module Alias

```bash
create-ddd-app module <module-name>
# or short command
create-ddd-app m <module-name>
```

**Example:**
```bash
create-ddd-app generate user
# or
create-ddd-app g user
```

This will generate:
```
src/
├── domain/
│   ├── entities/user.entity.ts
│   ├── repositories/user.repository.ts
│   └── value_objects/user.value-object.ts
├── application/
│   ├── dto/user.dto.ts
│   └── services/user.service.ts
├── infrastructure/
│   └── repositories/user.repository.impl.ts
└── interfaces/
    └── http/
        ├── user.controller.ts
        └── user.routes.ts
```

This command will create a new directory with the specified project name and generate the complete DDD structure inside it.

### Generator Options

#### 1. Custom Actions

If you want to create with specific actions only:

```bash
create-ddd-app generate user --actions index,show,create
```

#### 2. Skip Components

Skip generating specific components:

```bash
# Skip controller generation
create-ddd-app generate user --skip-controller

# Skip service generation
create-ddd-app generate user --skip-service

# Skip repository generation
create-ddd-app generate user --skip-repository
```

#### 3. Combined Options

```bash
create-ddd-app generate user --actions index,show --skip-controller
```

### Help

```bash
create-ddd-app --help
create-ddd-app generate --help
```

## 📁 Generated Project Structure

The CLI generates a comprehensive DDD project structure:

### Initial Project Structure

```
my-project/
├── src/
│   ├── domain/                    # Domain Layer
│   │   ├── entities/             # Business entities
│   │   ├── value_objects/        # Value objects
│   │   ├── repositories/         # Repository interfaces
│   │   └── events/              # Domain events
│   ├── application/              # Application Layer
│   │   ├── dto/                 # Data Transfer Objects
│   │   └── services/            # Application services
│   ├── infrastructure/           # Infrastructure Layer
│   │   ├── repositories/        # Repository implementations
│   │   ├── db/                  # Database configurations
│   │   ├── redis/               # Redis configurations
│   │   ├── messaging/           # Message queue implementations
│   │   └── config/              # Infrastructure configurations
│   ├── interfaces/               # Interface Layer
│   │   ├── http/                # HTTP controllers/routes
│   │   ├── graphql/             # GraphQL resolvers
│   │   └── cli/                 # CLI interfaces
│   └── shared/                   # Shared Components
│       ├── errors/              # Custom error classes
│       ├── utils/               # Utility functions
│       └── constants/           # Application constants
└── src/main.ts                   # Entry point (created if not exists)
```

### Generated Module Structure

When you run `create-ddd-app generate user`, it creates a complete DDD module:

```
src/
├── domain/
│   ├── entities/
│   │   └── user.entity.ts         # User domain entity
│   ├── repositories/
│   │   └── user.repository.ts     # Repository interface
│   └── value_objects/
│       └── user.value-object.ts   # Value object
├── application/
│   ├── dto/
│   │   └── user.dto.ts           # Data Transfer Objects
│   └── services/
│       └── user.service.ts       # Application service
├── infrastructure/
│   └── repositories/
│       └── user.repository.impl.ts # Repository implementation
└── interfaces/
    └── http/
        ├── user.controller.ts     # HTTP controller
        └── user.routes.ts        # Express routes
```

### Module File Contents

Each generated file includes:

- **Entity**: Domain entity with business logic
- **Repository Interface**: Contract for data access
- **Repository Implementation**: Concrete data access implementation
- **DTOs**: Request/Response data structures
- **Service**: Application business logic
- **Controller**: HTTP request handlers
- **Routes**: Express route definitions with dependency injection

### Default Actions

By default, each module generates these actions:
- `index` - List all resources
- `show` - Get single resource by ID
- `create` - Create new resource
- `update` - Update existing resource
- `destroy` - Delete resource

## 🏗️ Architecture Layers

### 1. Domain Layer (`src/domain/`)
- **Entities**: Core business objects with identity
- **Value Objects**: Objects defined by their attributes
- **Repositories**: Interfaces for data access
- **Events**: Domain events for business logic

### 2. Application Layer (`src/application/`)
- **DTOs**: Data transfer objects for API communication
- **Services**: Application-specific business logic

### 3. Infrastructure Layer (`src/infrastructure/`)
- **Repositories**: Concrete implementations of repository interfaces
- **Database**: Database connection and configuration
- **Redis**: Caching layer configuration
- **Messaging**: Message queue implementations
- **Config**: Infrastructure-related configurations

### 4. Interface Layer (`src/interfaces/`)
- **HTTP**: REST API controllers and routes
- **GraphQL**: GraphQL schema and resolvers
- **CLI**: Command-line interface implementations

### 5. Shared Layer (`src/shared/`)
- **Errors**: Custom error handling
- **Utils**: Reusable utility functions
- **Constants**: Application-wide constants

## 🔧 Entry Point Detection

## 💡 Examples

### Example 1: Generate a User Module

```bash\n# Create new project\ncreate-ddd-app new my-api\ncd my-api\n\n# Generate user module with all default actions\ncreate-ddd-app generate user\n```\n\nOutput:\n```\n✅ Generated user module:\n   create  src/domain/entities/user.entity.ts\n   create  src/domain/value_objects/user.value-object.ts\n   create  src/domain/repositories/user.repository.ts\n   create  src/application/dto/user.dto.ts\n   create  src/application/services/user.service.ts\n   create  src/infrastructure/repositories/user.repository.impl.ts\n   create  src/interfaces/http/user.controller.ts\n   create  src/interfaces/http/user.routes.ts\n```\n\n### Example 2: Generate with Custom Actions\n\n```bash\n# Only generate read operations\ncreate-ddd-app generate product --actions index,show\n```\n\n### Example 3: Generate API-only Module\n\n```bash\n# Skip controller for pure service layer\ncreate-ddd-app generate order --skip-controller\n```\n\n## 🔧 Entry Point Detection\n\nThe CLI intelligently detects existing entry points in the following order:

1. `src/main.ts`
2. `src/app.ts`
3. `src/index.ts`
4. `server.js`
5. `app.js`
6. `index.js`

If no entry point is found, it creates a default `src/main.ts` file.

## 🛠️ Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/vunontay/ddd-node.git
cd ddd-node
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run in development mode:
```bash
npm run dev
```

### Available Scripts

- `npm run clean` - Remove build artifacts
- `npm run build` - Build the project
- `npm run dev` - Development mode with watch
- `npm run start` - Run the built CLI
- `npm run release` - Publish to npm

## 📋 Technical Details

### Built With

- **TypeScript**: Type-safe JavaScript development
- **Commander.js**: Command-line interface framework
- **tsup**: Fast TypeScript bundler
- **Node.js**: Runtime environment

### Build Configuration

The project uses `tsup` for building with the following configuration:
- **Target**: Node.js 18+
- **Formats**: CommonJS and ESM
- **TypeScript**: Full type definitions included
- **Source Maps**: Generated for debugging

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow TypeScript best practices
2. Maintain the existing code style
3. Add tests for new features
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**vunontay** - [vunontay@gmail.com](mailto:vunontay@gmail.com)

- GitHub: [@vunontay](https://github.com/vunontay)
- npm: [@vunontay](https://www.npmjs.com/~vunontay)

## 🐛 Issues & Support

If you encounter any issues or have questions, please file an issue on the [GitHub Issues page](https://github.com/vunontay/ddd-node/issues).

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/create-ddd-app)
- [GitHub Repository](https://github.com/vunontay/ddd-node)
- [Homepage](https://github.com/vunontay/ddd-node)

## 📈 Changelog

### v1.1.0 (Latest)
- Added HMVC-style module generation (inspired by hmvc-rails)
- New `generate` and `module` commands
- Support for custom actions (index, show, create, update, destroy)
- Skip options for components (--skip-controller, --skip-service, etc.)
- Complete DDD module scaffolding with all layers
- File tracing with creator info and timestamps
- Dependency injection setup in routes

### v1.0.0
- Initial release
- Basic DDD project scaffolding
- TypeScript support
- Automatic entry point detection
- Complete folder structure generation

---

**Happy coding with Domain-Driven Design! 🚀**
