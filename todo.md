# Kuybi Dashboard - Project TODO

## Core Features

### Authentication & Authorization
- [ ] Login page with email/password form
- [ ] JWT token management (access & refresh tokens)
- [ ] Protected routes with authentication guards
- [ ] Logout functionality
- [ ] Auto-redirect to login for unauthenticated users

### Story Management
- [ ] List stories with pagination
- [ ] Create new story with categories and tags
- [ ] View story details
- [ ] Edit story
- [ ] Delete story
- [ ] Story search/filter functionality

### Category Management
- [ ] List all categories
- [ ] Create new category
- [ ] Edit category
- [ ] Delete category
- [ ] Assign categories to stories

### Tag Management
- [ ] List all tags
- [ ] Create new tag
- [ ] Edit tag
- [ ] Delete tag
- [ ] Assign tags to stories

### User Profile
- [ ] View user profile information
- [ ] Edit profile (name, email, etc.)
- [ ] Change password
- [ ] User logout

### UI/UX Components
- [ ] Navigation bar with user menu
- [ ] Sidebar navigation
- [ ] Dashboard overview page
- [ ] Responsive design for mobile/tablet
- [ ] Loading states and spinners
- [ ] Error handling and alerts
- [ ] Modal dialogs for forms
- [ ] Form validation

### API Integration
- [ ] Setup Axios with base configuration
- [ ] Auth service (login, logout, token refresh)
- [ ] Story service (CRUD operations)
- [ ] Category service (CRUD operations)
- [ ] Tag service (CRUD operations)
- [ ] User service (profile operations)

### State Management (Pinia)
- [ ] Auth store (user, token, login state)
- [ ] Story store (stories list, current story)
- [ ] Category store (categories list)
- [ ] Tag store (tags list)
- [ ] User store (profile data)

### Development Setup
- [ ] Configure environment variables
- [ ] Setup ESLint and Prettier
- [ ] Configure Tailwind CSS
- [ ] Setup Vue Router with protected routes
- [ ] Configure Pinia stores
- [ ] Setup Axios interceptors for token refresh

## Implementation Progress

### Phase 1: Project Setup ✅
- [x] Initialize Vue 3 project with Vite
- [x] Install core dependencies
- [x] Setup project structure

### Phase 2: Authentication
- [x] Create login page component
- [x] Implement auth service
- [x] Setup auth store
- [x] Configure route guards
- [x] Implement token refresh logic
- [x] Persist tokens in localStorage
- [x] Auto-refresh token on expiry
- [x] Add logout functionality

### Phase 3: Core Dashboard
- [x] Create dashboard layout (navbar, sidebar)
- [x] Setup main routes
- [x] Create dashboard overview page
- [x] Add navigation header to all inner pages
- [x] Highlight active page in navigation
- [x] Add breadcrumb navigation component
- [x] Add icons to breadcrumb levels
- [x] Animate breadcrumb icons with bounce effect
- [x] Add breadcrumb animation customization

### Phase 4: Story Management
- [x] Story list page with titles and creation dates
- [x] Add status filter to stories list
- [x] Add sorting by creation date and title
- [x] Add search by title and content functionality
- [x] Story create/edit form
- [x] Add type and priority fields to story form
- [x] Add story preview feature
- [x] Story edit feature
- [x] Display all categories for each story
- [x] Add multi-select category filter
- [x] Add sorting by priority level
- [x] Add tag autocomplete feature
- [ ] Story detail view
- [ ] Story delete functionality

### Phase 5: Category & Tag Management
- [x] Category management page
- [x] Tag management page
- [ ] Form components for create/edit

### Phase 6: User Profile
- [x] Profile page with user information display
- [x] Profile edit form with validation
- [x] Password change functionality

### Phase 7: Media Management
- [x] Media page with attachments list
- [x] Upload media functionality
- [x] Delete media functionality
- [x] Media preview/display
- [x] File type filtering

### Phase 8: Navigation Refactor
- [x] Replace top navbar with sidebar navigation
- [x] Create DashboardLayout component with collapsible menu
- [x] Update Dashboard page to use sidebar layout
- [x] Update Stories page to use sidebar layout
- [x] Update Categories page to use sidebar layout
- [x] Update Tags page to use sidebar layout
- [x] Update Media page to use sidebar layout
- [x] Update Settings page to use sidebar layout
- [x] Update Profile page to use sidebar layout
- [x] Update CreateStory page to use sidebar layout
- [x] Update EditStory page to use sidebar layout
- [x] Add mobile-responsive sidebar toggle
- [x] Maintain active route highlighting

### Phase 9: Media Service Update
- [x] Update mediaService to match actual API response structure
- [x] Fix attachment property mapping (path, originalName, url, previewUrl)
- [x] Update Media.vue to display correct attachment data
- [x] Add thumbnail preview support
- [x] Fix file type detection based on mimeType

### Phase 10: Media Page Fixes
- [x] Fix media page stuck on loading state
- [x] Debug API response parsing
- [x] Add category filter (photos, uploads, etc.)
- [x] Add mimeType filter (image/, video/, etc.)
- [x] Add isPublic filter
- [x] Add size range filters (minSize, maxSize)
- [x] Add sorting options (createdAt, size, etc.)
- [x] Implement advanced search with multiple filters

### Phase 11: Bug Fixes
- [x] Fix toLowerCase error in Media page (line 73)
- [x] Debug undefined property access
- [x] Add null/undefined checks for file type detection

### Phase 12: UI Enhancements
- [x] Add loading animation while fetching attachments
- [x] Add skeleton loaders for media grid
- [x] Improve loading states with visual feedback

### Phase 13: Navigation Cleanup
- [x] Remove Breadcrumb component from all pages
- [x] Remove Breadcrumb imports from all pages
- [x] Clean up unused navigation code
- [x] Restore Breadcrumb component to all pages
- [x] Remove menu items from sidebar header
- [x] Keep sidebar structure but remove navigation menu

### Phase 14: Sidebar & Breadcrumb Updates
- [x] Add navigation menu back to sidebar
- [x] Add breadcrumbs to all pages
- [x] Remove menu from top header
- [x] Update DashboardLayout to show sidebar menu on all pages

### Phase 15: Image Management Features
- [x] Add profile image change functionality to Profile page
- [x] Add main image assignment to Stories page
- [x] Add main image removal from Stories
- [x] Create image picker modal for attachment selection
- [x] Update userService with profile image endpoint
- [x] Update storyService with main image endpoints
- [x] Implement image picker modal with media library
- [x] Add image selection and confirmation
- [x] Add loading states for image selection
- [x] Implement image picker modal for Stories page
- [ ] Add main image display on story cards
- [x] Add remove main image functionality
- [x] Add clear main image button to Stories page
- [x] Implement removeMainImage function in Stories page
- [x] Add placeholder image for stories without main image
- [x] Display main image in story table or cards

### Phase 16: Drag-and-Drop Feature
- [x] Add drag-and-drop to media library modal
- [x] Implement image reordering functionality
- [x] Add visual feedback during drag operations
- [x] Persist reordering state

### Phase 17: Bug Fixes
- [x] Fix authentication persistence on page refresh
- [x] Implement token storage in localStorage
- [x] Add auth state restoration on app load

### Phase 18: Axios Interceptors
- [x] Setup axios request interceptor to add auth token
- [x] Setup axios response interceptor for token refresh
- [x] Handle 401 errors with automatic token refresh
- [x] Retry failed requests after token refresh
- [x] Prevent infinite refresh loops

### Phase 19: Global Loading Indicator
- [x] Create loading store for global state
- [x] Create LoadingIndicator component
- [x] Setup axios interceptors to trigger loading
- [x] Add loading indicator to App.vue
- [x] Test loading states across all pages

### Phase 20: Loading Indicator Customization
- [x] Customize loading animation to match brand identity
- [x] Add brand colors to loading indicator
- [x] Improve animation smoothness and visual appeal

### Phase 21: Polish & Testing
- [ ] Error handling improvements
- [ ] Loading states refinement
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Final review and deployment

## Known Issues
- [x] Update all API endpoints to include /v1/ version prefix
- [x] Fix Stories API response parsing - data structure uses 'results' instead of 'stories'
- [x] Fix categories list empty in Create Story page
- [x] Fix story create payload structure - use categoryIds array and tags string array
- [x] Update user profile endpoint to /api/v1/users/me

## Notes
- API Base URL: http://localhost:4040/api
- Default login: admin@kuybi.dev / Admin@123
- Using Tailwind CSS for styling
- Using Pinia for state management
- Using Vue Router for navigation
