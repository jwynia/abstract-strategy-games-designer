# OpenAPI Specification

## Overview

The Abstract Strategy Games API has been formalized as an OpenAPI 3.0.3 specification, enabling automatic code generation for both server implementations and client SDKs.

## Classification
- **Domain:** Technical Asset
- **Stability:** Versioned
- **Abstraction:** Implementation
- **Confidence:** High

## Specification Location

The OpenAPI specification is maintained at:
- **Primary**: `/api/openapi.json`
- **Documentation**: `/api/README.md`

## Key Features

### Comprehensive Coverage
- All endpoints from the API protocol specification
- Full request/response schemas
- Error handling patterns
- Authentication methods

### Code Generation Ready
- Valid OpenAPI 3.0.3 format
- Detailed schemas for all data types
- Proper operation IDs for method naming
- Tagged endpoints for organization

### Extensibility Support
- Federation endpoints included
- Plugin architecture considerations
- Webhook support for real-time updates
- Legacy compatibility endpoints

## Using the Specification

### Generate Server Implementation

```bash
# Node.js/Express
npx @openapitools/openapi-generator-cli generate \
  -i api/openapi.json \
  -g nodejs-express-server \
  -o server/generated

# Python/FastAPI  
openapi-generator generate \
  -i api/openapi.json \
  -g python-fastapi \
  -o server/generated

# Go/Gin
openapi-generator generate \
  -i api/openapi.json \
  -g go-gin-server \
  -o server/generated
```

### Generate Client SDKs

```bash
# TypeScript/Axios
npx @openapitools/openapi-generator-cli generate \
  -i api/openapi.json \
  -g typescript-axios \
  -o sdk/typescript

# Python
openapi-generator generate \
  -i api/openapi.json \
  -g python \
  -o sdk/python
```

### Validate Specification

```bash
npx @openapitools/openapi-generator-cli validate -i api/openapi.json
```

## Specification Highlights

### Endpoints Included
- Game catalog management
- Game instance lifecycle
- Move execution and validation
- Game state rendering
- Player profiles and statistics
- Federation server discovery
- Webhook registration
- Legacy AbstractPlay endpoints

### Security Schemes
- Bearer token (JWT)
- API key authentication
- OAuth 2.0 for federation

### Response Formats
- Consistent error structure
- Pagination support
- Rate limiting headers
- Request ID tracking

## Development Workflow

1. **Modify Protocol**: Update protocol documentation
2. **Update OpenAPI**: Reflect changes in `openapi.json`
3. **Validate**: Run validation to ensure correctness
4. **Generate**: Create new server/client code
5. **Implement**: Fill in generated interfaces
6. **Test**: Use generated clients for testing

## Version Management

The specification includes version in:
- Info section: API version
- URL paths: `/v1/` prefix
- Accept headers: Version negotiation

## Benefits

### For Backend Developers
- Skip boilerplate code
- Focus on business logic
- Consistent API structure
- Type-safe implementations

### For Frontend Developers
- Generated TypeScript types
- Auto-complete support
- Reduced errors
- Always in sync with backend

### For Platform Users
- Multiple language SDKs
- Consistent experience
- Clear documentation
- Predictable behavior

## Next Steps

1. Choose target language/framework
2. Run code generator
3. Implement business logic
4. Deploy with confidence

## Relationships
- **Parent Node:** [[index.md]]
- **Related Nodes:**
  - [[api-protocol-specification.md]] - Source protocol
  - [[extension-strategy.md]] - Extension approach
  - [[abstractplay-compatibility-guide.md]] - Legacy support

## References
- OpenAPI Specification 3.0.3
- OpenAPI Generator documentation
- Swagger/Redoc for visualization

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Status:** Complete