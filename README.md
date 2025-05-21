# NestJS gRPC Microservice with Kafka

A microservice architecture using NestJS, gRPC, and Kafka (in progress).

## 🛠 Tech Stack

- **Node.js**: v22
- **Package Manager**: npm
- **Database**: MySQL
- **Framework**: NestJS
- **Communication**: gRPC
- **Message Broker**: Kafka (In Progress)

## 📁 Project Structure

```
.
├── api-gateway/          # API Gateway Service
├── grpc-user/           # User Microservice
├── shared/              # Shared Resources
│   ├── errors/         # Error Handling
│   └── proto/          # Protocol Buffers
└── docker/             # Docker Configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js v22
- MySQL
- npm

### Environment Setup

1. Create `.env` files in both `api-gateway` and `grpc-user` directories:

```env
# api-gateway/.env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=user_db
```

### Installation

```bash
# Install dependencies
npm install
```

### Running the Services

```bash
# ts compile proto files
npm run pbcompile

# Start User Service
npm run start:user

# Start API Gateway
npm run start:api
```

## 🏗 Architecture

### Monorepo Structure
- **api-gateway**: HTTP to gRPC gateway
- **grpc-user**: User management microservice
- **shared**: Common resources (protos, errors)

### gRPC Communication
- Protocol Buffers for service definitions
- Type-safe communication between services
- Efficient binary protocol

### Kafka Integration (In Progress)
- Message broker for event-driven architecture
- Asynchronous communication between services
- Event sourcing and CQRS patterns

## 📚 API Documentation

Once the services are running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## 🔄 Error Handling

The project implements a comprehensive error handling system:
- gRPC to HTTP error mapping
- Consistent error response format
- Detailed error logging

## 🚧 In Progress

- [ ] Kafka integration
- [ ] Event-driven architecture
- [ ] CQRS implementation
- [ ] Additional microservices 