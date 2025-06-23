# Abstract Strategy Games API

This directory contains the OpenAPI specification for the Abstract Strategy Games platform API.

## Files

- `openapi.json` - OpenAPI 3.0.3 specification
- `openapi.yaml` - (Optional) YAML version for easier editing

## Using the OpenAPI Spec

### Generate Server Stubs

#### Node.js/Express
```bash
npx @openapitools/openapi-generator-cli generate \
  -i openapi.json \
  -g nodejs-express-server \
  -o ../server/generated
```

#### Python/FastAPI
```bash
openapi-generator generate \
  -i openapi.json \
  -g python-fastapi \
  -o ../server/generated
```

#### Go/Gin
```bash
openapi-generator generate \
  -i openapi.json \
  -g go-gin-server \
  -o ../server/generated
```

### Generate Client SDKs

#### TypeScript
```bash
npx @openapitools/openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o ../sdk/typescript
```

#### Python
```bash
openapi-generator generate \
  -i openapi.json \
  -g python \
  -o ../sdk/python
```

### Validate the Spec

```bash
npx @openapitools/openapi-generator-cli validate -i openapi.json
```

### View Documentation

Use Swagger UI or Redoc to view interactive documentation:

```bash
# Swagger UI
npx @redocly/openapi-cli preview-docs openapi.json

# Or use a simple HTTP server
python -m http.server 8000
# Then open http://localhost:8000 and use Swagger UI online with your local file
```

## API Overview

The API provides:

- **Game Management**: List games, get details, create instances
- **Game Play**: Make moves, get game state, render boards
- **Player Management**: Profiles, statistics, game history
- **Federation**: Cross-server gameplay
- **Webhooks**: Real-time event notifications
- **Legacy Support**: AbstractPlay compatibility endpoints

## Authentication

The API supports:
- Bearer tokens (JWT)
- API keys
- OAuth 2.0 (for federation)

## Key Features

1. **Protocol-based**: Clean separation between interface and implementation
2. **Extensible**: Support for plugins and custom games
3. **Federated**: Games can span multiple servers
4. **Compatible**: Maintains AbstractPlay compatibility
5. **Real-time**: WebSocket and webhook support

## Development Workflow

1. Edit `openapi.json` to add/modify endpoints
2. Validate the spec: `npx @openapitools/openapi-generator-cli validate -i openapi.json`
3. Generate updated server code
4. Implement the generated interfaces
5. Generate client SDKs for testing

## Contributing

When modifying the API:
1. Update the OpenAPI spec
2. Increment the version number
3. Document breaking changes
4. Update this README if needed