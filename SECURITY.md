# Security Guide

## Authentication & Authorization

### JWT Token Security
- Tokens expire after 24 hours
- Secure token storage in localStorage
- Automatic token refresh on API calls
- Protected routes with authentication middleware

### Password Security
- Passwords hashed with bcryptjs (10 salt rounds)
- Minimum 6 characters requirement
- No plain text password storage
- Secure password validation

### API Security
- CORS enabled with proper configuration
- Helmet.js for security headers
- Express rate limiting (recommended for production)
- Input validation with express-validator

## Environment Variables

### Required Environment Variables
```bash
# Server
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=3001
NODE_ENV=development

# Client
VITE_API_URL=http://localhost:3001/api
```

### Security Best Practices
1. Use strong, unique JWT secrets in production
2. Enable HTTPS in production
3. Implement rate limiting
4. Use secure database connections
5. Regular security audits with `npm audit`

## Database Security

### Connection Security
- SSL/TLS encrypted connections
- Connection pooling with proper limits
- Parameterized queries to prevent SQL injection
- Database user with minimal required permissions

### Data Protection
- User passwords are hashed and salted
- Sensitive data encryption at rest
- Regular database backups
- Access logging and monitoring

## Frontend Security

### XSS Prevention
- Content Security Policy headers
- Input sanitization and validation
- React's built-in XSS protection
- Escape user-generated content

### CSRF Protection
- SameSite cookie attributes
- Token-based authentication
- Origin validation
- Proper CORS configuration

## Deployment Security

### Production Checklist
- [ ] Use HTTPS everywhere
- [ ] Set secure JWT secrets
- [ ] Enable rate limiting
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Database connection security
- [ ] Environment variable security

### Recommended Security Headers
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## Monitoring & Logging

### Security Events to Monitor
- Failed login attempts
- Invalid token usage
- Unusual API request patterns
- Database connection errors
- Authentication failures

### Logging Best Practices
- Log security events without sensitive data
- Use structured logging format
- Implement log rotation
- Monitor logs for suspicious activity
- Set up alerts for security events
