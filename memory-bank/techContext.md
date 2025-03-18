# Technical Context: Ubiquity DAO Hub

## Technologies Used

### Frontend
- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Typed superset of JavaScript for improved developer experience
- **React**: JavaScript library for building user interfaces
- **CSS Modules**: Scoped CSS for component styling
- **react-notion-x**: Library for rendering Notion content in React

### Backend / API
- **Notion API**: Content management system and API
- **Next.js API Routes**: Serverless functions for backend logic

### Infrastructure
- **Vercel**: Hosting platform optimized for Next.js
- **GitHub**: Version control and CI/CD integration
- **Redis** (optional): For caching preview images

### Development Tools
- **pnpm**: Package manager
- **Bun**: JavaScript runtime for running TypeScript files
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting

## Development Setup

### Prerequisites
- Node.js >= 18
- pnpm (for package management)
- Bun (for running TypeScript files)
- Notion account with appropriate permissions

### Environment Variables
The application uses several environment variables for configuration:
- **NEXT_PUBLIC_FATHOM_ID** (optional): For Fathom analytics
- **NEXT_PUBLIC_POSTHOG_ID** (optional): For PostHog analytics
- **TWITTER_ACCESS_TOKEN** (optional): For rendering tweets
- **REDIS_HOST** (optional): For Redis caching
- **REDIS_PASSWORD** (optional): For Redis authentication
- **REDIS_USER** (optional): For Redis user
- **REDIS_NAMESPACE** (optional): For Redis namespace

### Local Development
1. Clone the repository
2. Install dependencies with `pnpm install`
3. Create a `.env` file based on `.env.example`
4. Run the development server with `pnpm dev`

### Build and Deployment
1. Build the application with `pnpm build`
2. Deploy to Vercel with `pnpm deploy`

## Technical Constraints

### Notion Integration Limitations
- Limited customization of Notion content rendering
- Dependency on Notion's API stability and performance
- Need to ensure Notion pages are public for access

### Performance Considerations
- Large Notion pages may impact load times
- Preview image generation can be resource-intensive
- Need to balance rich content with performance

### Browser Compatibility
- Modern browser support (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Responsive design for mobile and desktop

### Dependency Management
- Some dependencies may have deprecation warnings (e.g., @react-icons/all-files)
- Need to regularly update dependencies for security and features
- Potential conflicts between dependencies

## Development Workflow

### Code Organization
- **/components**: React components
- **/lib**: Utility functions and shared code
- **/pages**: Next.js pages and API routes
- **/public**: Static assets
- **/styles**: Global styles

### Testing Strategy
- ESLint for code quality
- Prettier for code formatting
- Manual testing for UI and functionality

### Deployment Pipeline
1. Code changes pushed to GitHub
2. Vercel automatically builds and deploys
3. Preview deployments for pull requests
4. Production deployment for main branch

## Technical Debt and Improvement Areas

### Current Technical Debt
- Deprecation warning for @react-icons/all-files package
- Potential outdated dependencies
- Need for improved documentation

### Improvement Opportunities
- Implement automated testing
- Enhance performance optimization
- Improve accessibility compliance
- Update dependencies regularly
