# Tasks: App Promoções

## Task 1: Project Setup and Environment Configuration
**Status**: not_started
**Type**: setup
**Complexity**: low

Configure development environment with proper .env files and dependencies.

### Acceptance Criteria
- Frontend .env configured with VITE_API_URL and Supabase keys
- Backend .env configured with Supabase credentials and PORT
- All dependencies installed (npm install in both frontend and backend)
- Development servers can start without errors

### Sub-tasks
- [x] Verify frontend .env has VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
- [x] Verify backend .env has SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, PORT
- [x] Run npm install in frontend directory
- [x] Run npm install in backend directory
- [x] Test frontend dev server: npm run dev
- [x] Test backend dev server: npm run dev

---

## Task 2: Database Schema and Supabase Configuration
**Status**: not_started
**Type**: infrastructure
**Complexity**: medium
**Depends on**: Task 1

Create database tables and configure Supabase storage.

### Acceptance Criteria
- profiles table created with columns: id, name, email, cpf, role, created_at
- promotions table created with all required fields
- favorites table created with composite key
- RLS policies configured for all tables
- Storage bucket "promotions" created with public read access

### Sub-tasks
- [x] Create profiles table with unique constraints on email and cpf
- [x] Create promotions table with user_id foreign key
- [ ] Create favorites table with composite primary key (user_id, promotion_id)
- [ ] Create indexes on frequently queried columns (category, created_at, user_id)
- [ ] Configure RLS policies for profiles table
- [ ] Configure RLS policies for promotions table
- [ ] Configure RLS policies for favorites table
- [ ] Create storage bucket "promotions" with public read policy

---

## Task 3: Backend Authentication Routes
**Status**: not_started
**Type**: backend
**Complexity**: medium
**Depends on**: Task 2

Implement authentication endpoints (signup, login, logout).

### Acceptance Criteria
- POST /api/auth/signup creates user and profile record
- POST /api/auth/login accepts email or CPF
- POST /api/auth/logout clears session
- JWT validation middleware working
- Email and CPF uniqueness enforced
- Password validation (min 6 chars)

### Sub-tasks
- [ ] Implement signup endpoint with email/CPF validation
- [ ] Implement login endpoint with email or CPF lookup
- [ ] Implement logout endpoint
- [ ] Add JWT validation middleware
- [ ] Add error handling for duplicate email/CPF
- [ ] Test signup with valid credentials
- [ ] Test login with email and CPF
- [ ] Test JWT token refresh

---

## Task 4: Backend Promotions Routes
**Status**: not_started
**Type**: backend
**Complexity**: medium
**Depends on**: Task 3

Implement promotion CRUD endpoints.

### Acceptance Criteria
- GET /api/promotions returns all promotions
- GET /api/promotions/:id returns single promotion
- POST /api/promotions creates promotion (establishment only)
- PUT /api/promotions/:id updates promotion (owner only)
- DELETE /api/promotions/:id deletes promotion (owner only)
- Ownership validation enforced

### Sub-tasks
- [ ] Implement GET /api/promotions with filtering and sorting
- [ ] Implement GET /api/promotions/:id
- [ ] Implement POST /api/promotions with ownership check
- [ ] Implement PUT /api/promotions/:id with ownership check
- [ ] Implement DELETE /api/promotions/:id with ownership check
- [ ] Add category validation
- [ ] Add price validation (positive number)
- [ ] Test all endpoints with valid and invalid data

---

## Task 5: Backend Image Upload
**Status**: not_started
**Type**: backend
**Complexity**: medium
**Depends on**: Task 2

Implement image upload to Supabase Storage.

### Acceptance Criteria
- POST /api/upload accepts JPEG, PNG, WebP files
- Files uploaded to Supabase Storage bucket
- Public URLs returned for uploaded files
- File type validation enforced
- File size limits enforced

### Sub-tasks
- [ ] Configure Multer for file upload handling
- [ ] Implement file type validation (JPEG, PNG, WebP)
- [ ] Implement file size validation
- [ ] Upload files to Supabase Storage
- [ ] Generate and return public URLs
- [ ] Handle upload errors gracefully
- [ ] Test with valid and invalid file types

---

## Task 6: Backend Favorites Routes
**Status**: not_started
**type**: backend
**Complexity**: low
**Depends on**: Task 4

Implement favorites management endpoints.

### Acceptance Criteria
- GET /api/favorites returns user's favorite promotions
- POST /api/favorites/:promotionId adds to favorites
- DELETE /api/favorites/:promotionId removes from favorites
- Duplicate favorites prevented
- User isolation enforced

### Sub-tasks
- [ ] Implement GET /api/favorites
- [ ] Implement POST /api/favorites/:promotionId
- [ ] Implement DELETE /api/favorites/:promotionId
- [ ] Add duplicate prevention
- [ ] Test favorite operations
- [ ] Verify user isolation

---

## Task 7: Frontend Authentication Pages
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 3

Create Login and Register pages with form validation.

### Acceptance Criteria
- Login page accepts email or CPF
- Register page collects name, email, CPF, password, role
- Form validation with React Hook Form + Zod
- Error messages displayed in Portuguese
- Successful auth redirects to Home
- Session persisted in localStorage

### Sub-tasks
- [ ] Create Login.tsx page
- [ ] Create Register.tsx page
- [ ] Implement form validation schemas
- [ ] Add email/CPF validation
- [ ] Add password validation
- [ ] Implement error message display
- [ ] Test signup flow
- [ ] Test login with email
- [ ] Test login with CPF
- [ ] Verify session persistence

---

## Task 8: Frontend Auth Context and Hooks
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 7

Implement global authentication state management.

### Acceptance Criteria
- AuthContext provides user, profile, role, loading state
- useAuth hook available for all components
- Session restored on app load
- Token refresh handled automatically
- Logout clears session

### Sub-tasks
- [ ] Create AuthContext with proper types
- [ ] Implement AuthProvider wrapper
- [ ] Create useAuth hook
- [ ] Implement session restoration on mount
- [ ] Implement token refresh logic
- [ ] Test auth state persistence
- [ ] Test logout functionality

---

## Task 9: Frontend Protected Routes
**Status**: not_started
**Type**: frontend
**Complexity**: low
**Depends on**: Task 8

Implement route protection and redirects.

### Acceptance Criteria
- Unauthenticated users redirected to /login
- Establishment-only routes protected
- User-only routes protected
- Navigation between protected routes works
- Redirect to login on token expiration

### Sub-tasks
- [ ] Create ProtectedRoute component
- [ ] Create EstablishmentRoute component
- [ ] Implement route guards in App.tsx
- [ ] Test unauthenticated access
- [ ] Test establishment-only routes
- [ ] Test user-only routes

---

## Task 10: Frontend Home Page - Hero Banner
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 4

Implement Hero Banner component showing most recent promotion.

### Acceptance Criteria
- Displays most recent promotion (highest created_at)
- Shows image, title, price, store name
- Clickable to navigate to promotion detail
- Fallback message if no promotions
- Responsive design

### Sub-tasks
- [ ] Create HeroBanner.tsx component
- [ ] Fetch most recent promotion
- [ ] Display promotion details
- [ ] Implement click navigation
- [ ] Add fallback message
- [ ] Test responsive layout
- [ ] Test with no promotions

---

## Task 11: Frontend Home Page - Stories Bar
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 4

Implement Stories Bar showing 10 most recent promotions.

### Acceptance Criteria
- Displays 10 most recent promotions
- Horizontal scrollable without visible scrollbar
- Circular image thumbnails with store name
- Clickable to navigate to promotion detail
- Smooth scroll behavior

### Sub-tasks
- [ ] Create StoriesBar.tsx component
- [ ] Fetch 10 most recent promotions
- [ ] Implement horizontal scroll
- [ ] Hide scrollbar with CSS
- [ ] Add click navigation
- [ ] Test scroll behavior
- [ ] Test responsive sizing

---

## Task 12: Frontend Home Page - Netflix Row
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 4

Implement Netflix Row showing promotions sorted by price.

### Acceptance Criteria
- Displays promotions sorted by price (ascending)
- Horizontal scrollable without visible scrollbar
- Shows PromotionCard for each item
- Clickable to navigate to promotion detail
- Smooth scroll behavior

### Sub-tasks
- [ ] Create NetflixRow.tsx component
- [ ] Fetch promotions sorted by price
- [ ] Implement horizontal scroll
- [ ] Hide scrollbar with CSS
- [ ] Add click navigation
- [ ] Test scroll behavior
- [ ] Test price ordering

---

## Task 13: Frontend Home Page - Category Filter
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 4

Implement Category Filter for filtering promotions.

### Acceptance Criteria
- Displays 10 categories with icons
- Horizontal scrollable
- Single selection toggle
- Filters promotions in real-time
- Selected category highlighted

### Sub-tasks
- [ ] Create CategoryFilter.tsx component
- [ ] Define 10 categories with icons
- [ ] Implement selection toggle
- [ ] Implement filtering logic
- [ ] Add visual highlighting
- [ ] Test category selection
- [ ] Test filter application

---

## Task 14: Frontend Home Page - Promotion List
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 4, Task 13

Implement main promotion list with pull-to-refresh.

### Acceptance Criteria
- Displays all promotions as PromotionCards
- Pull-to-refresh gesture reloads data
- Loading indicator shown during fetch
- Error message on failure
- Respects category filter
- Responsive grid layout

### Sub-tasks
- [ ] Create promotion list component
- [ ] Implement pull-to-refresh
- [ ] Add loading indicator
- [ ] Add error handling
- [ ] Implement responsive grid
- [ ] Test pull-to-refresh
- [ ] Test error handling

---

## Task 15: Frontend Promotion Card Component
**Status**: not_started
**Type**: frontend
**Complexity**: low
**Depends on**: Task 4

Create reusable PromotionCard component.

### Acceptance Criteria
- Displays image, title, price, store, category
- Clickable to navigate to detail
- Favorite button for users
- Responsive sizing
- Consistent height

### Sub-tasks
- [ ] Create PromotionCard.tsx component
- [ ] Display all required fields
- [ ] Implement click navigation
- [ ] Add favorite button
- [ ] Test responsive layout
- [ ] Test height consistency

---

## Task 16: Frontend Promotion Detail Page
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 4, Task 15

Implement promotion detail page with full information.

### Acceptance Criteria
- Displays all promotion details
- Image carousel for multiple images
- Favorite button for users
- Edit/Delete buttons for owner
- Complete address information
- Back button to previous page

### Sub-tasks
- [ ] Create PromotionDetail.tsx page
- [ ] Implement image carousel
- [ ] Display all promotion fields
- [ ] Add favorite button
- [ ] Add edit/delete buttons (owner only)
- [ ] Implement back navigation
- [ ] Test with owner and non-owner
- [ ] Test image carousel

---

## Task 17: Frontend Create Promotion Form
**Status**: not_started
**Type**: frontend
**Complexity**: high
**Depends on**: Task 5, Task 8

Implement promotion creation form with geolocation.

### Acceptance Criteria
- Form fields: title, price, store, category, address, city, state, CEP, images
- Geolocation button requests GPS permission
- Auto-fill address from GPS coordinates
- CEP field triggers ViaCEP lookup
- Image upload with preview
- Form validation with error messages
- Submit creates promotion

### Sub-tasks
- [ ] Create CreatePromotion.tsx page
- [ ] Implement form fields
- [ ] Add geolocation service integration
- [ ] Implement CEP lookup via ViaCEP
- [ ] Implement reverse geocoding
- [ ] Add image uploader
- [ ] Implement form validation
- [ ] Test geolocation flow
- [ ] Test CEP lookup
- [ ] Test image upload
- [ ] Test form submission

---

## Task 18: Frontend Edit Promotion Form
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 17

Implement promotion editing functionality.

### Acceptance Criteria
- Form pre-filled with current promotion data
- All fields editable
- Image upload for new images
- Form validation
- Submit updates promotion
- Owner-only access

### Sub-tasks
- [ ] Create EditPromotion.tsx page
- [ ] Load promotion data
- [ ] Pre-fill form fields
- [ ] Implement image update
- [ ] Test form submission
- [ ] Test owner-only access

---

## Task 19: Frontend Delete Promotion
**Status**: not_started
**Type**: frontend
**Complexity**: low
**Depends on**: Task 16

Implement promotion deletion with confirmation.

### Acceptance Criteria
- Delete button on promotion detail
- Confirmation dialog shown
- Deletes promotion and images
- Redirects to home on success
- Error message on failure
- Owner-only access

### Sub-tasks
- [ ] Add delete button to PromotionDetail
- [ ] Create confirmation dialog
- [ ] Implement deletion API call
- [ ] Handle success/error
- [ ] Test deletion flow

---

## Task 20: Frontend Map Page
**Status**: not_started
**Type**: frontend
**Complexity**: high
**Depends on**: Task 4

Implement interactive map with promotion markers.

### Acceptance Criteria
- Displays map using react-leaflet
- Shows markers for promotions with coordinates
- Popup shows title, price, store on marker click
- Popup click navigates to promotion detail
- Back button to home
- Responsive layout

### Sub-tasks
- [ ] Create Map.tsx page
- [ ] Integrate react-leaflet
- [ ] Fetch promotions with coordinates
- [ ] Add markers to map
- [ ] Implement popup display
- [ ] Add click navigation
- [ ] Test marker display
- [ ] Test popup interaction
- [ ] Test responsive layout

---

## Task 21: Frontend Favorites Page
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 6, Task 15

Implement favorites page showing user's favorite promotions.

### Acceptance Criteria
- Displays all user's favorite promotions
- Shows as PromotionCards
- Remove from favorites button
- Empty state message
- Responsive grid layout

### Sub-tasks
- [ ] Create Favorites.tsx page
- [ ] Fetch user's favorites
- [ ] Display as PromotionCards
- [ ] Implement remove button
- [ ] Add empty state message
- [ ] Test responsive layout

---

## Task 22: Frontend Favorites Service
**Status**: not_started
**Type**: frontend
**Complexity**: low
**Depends on**: Task 6

Implement favorites management service.

### Acceptance Criteria
- Add favorite function
- Remove favorite function
- Check if favorited function
- Get all favorites function
- Proper error handling

### Sub-tasks
- [ ] Create favorites.ts service
- [ ] Implement add favorite
- [ ] Implement remove favorite
- [ ] Implement is favorited check
- [ ] Implement get favorites
- [ ] Test all functions

---

## Task 23: Frontend Geolocation Service
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 1

Implement geolocation and address lookup service.

### Acceptance Criteria
- Request browser geolocation
- Get GPS coordinates
- Reverse geocode coordinates to address
- CEP lookup via ViaCEP API
- Error handling for permission denied
- Proper address formatting

### Sub-tasks
- [ ] Create geolocation.ts service
- [ ] Implement browser geolocation
- [ ] Implement reverse geocoding
- [ ] Implement CEP lookup
- [ ] Add error handling
- [ ] Test geolocation flow
- [ ] Test CEP lookup
- [ ] Test reverse geocoding

---

## Task 24: Frontend Image Upload Service
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 5

Implement image upload service.

### Acceptance Criteria
- Upload single image
- Upload multiple images
- File type validation (JPEG, PNG, WebP)
- File size validation
- Return public URLs
- Error handling

### Sub-tasks
- [ ] Create upload.ts service
- [ ] Implement single upload
- [ ] Implement multiple upload
- [ ] Add file type validation
- [ ] Add file size validation
- [ ] Test upload flow
- [ ] Test validation

---

## Task 25: Frontend Navigation Bar
**Status**: not_started
**Type**: frontend
**Complexity**: low
**Depends on**: Task 8

Implement bottom navigation bar.

### Acceptance Criteria
- Shows Home, Map, Favorites tabs
- Active tab highlighted
- Visible only when authenticated
- Responsive design
- Click navigation works

### Sub-tasks
- [ ] Create NavigationBar.tsx component
- [ ] Add three tabs
- [ ] Implement active highlighting
- [ ] Add click navigation
- [ ] Test responsive layout

---

## Task 26: Frontend Layout Components
**Status**: not_started
**Type**: frontend
**Complexity**: low
**Depends on**: Task 8

Create layout wrapper components.

### Acceptance Criteria
- PageWrapper component
- Header component
- Footer component
- Consistent styling
- Responsive design

### Sub-tasks
- [ ] Create PageWrapper.tsx
- [ ] Create Header.tsx
- [ ] Create Footer.tsx
- [ ] Test layout consistency
- [ ] Test responsive design

---

## Task 27: Frontend UI Components
**Status**: not_started
**Type**: frontend
**Complexity**: low
**Depends on**: Task 1

Create reusable UI components.

### Acceptance Criteria
- Button component with variants
- Card component
- Input component with validation
- Skeleton loading component
- Consistent styling

### Sub-tasks
- [ ] Create Button.tsx
- [ ] Create Card.tsx
- [ ] Create Input.tsx
- [ ] Create Skeleton.tsx
- [ ] Test all components

---

## Task 28: Frontend App Router Setup
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 9, Task 26

Configure React Router with all routes.

### Acceptance Criteria
- All routes defined
- Protected routes working
- Establishment-only routes working
- Navigation between routes smooth
- 404 handling

### Sub-tasks
- [ ] Configure React Router v6
- [ ] Define all routes
- [ ] Implement route protection
- [ ] Test navigation
- [ ] Test 404 handling

---

## Task 29: Frontend Form Validation
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 1

Implement form validation schemas.

### Acceptance Criteria
- Signup form validation
- Login form validation
- Promotion form validation
- Email validation
- CPF validation
- Password validation
- CEP validation

### Sub-tasks
- [ ] Create validators.ts file
- [ ] Implement signup schema
- [ ] Implement login schema
- [ ] Implement promotion schema
- [ ] Test all validators

---

## Task 30: Frontend API Service
**Status**: not_started
**Type**: frontend
**Complexity**: medium
**Depends on**: Task 1

Implement HTTP client for backend communication.

### Acceptance Criteria
- GET, POST, PUT, DELETE methods
- JWT token injection
- Error handling
- Request/response interceptors
- Proper error messages

### Sub-tasks
- [ ] Create api.ts service
- [ ] Implement HTTP methods
- [ ] Add JWT injection
- [ ] Add error handling
- [ ] Test API calls

---

## Task 31: Integration Testing - Authentication Flow
**Status**: not_started
**Type**: testing
**Complexity**: medium
**Depends on**: Task 7, Task 3

Test complete authentication flow.

### Acceptance Criteria
- Signup creates user and profile
- Login with email works
- Login with CPF works
- Session persists
- Logout clears session
- Protected routes redirect

### Sub-tasks
- [ ] Test signup flow
- [ ] Test login with email
- [ ] Test login with CPF
- [ ] Test session persistence
- [ ] Test logout
- [ ] Test route protection

---

## Task 32: Integration Testing - Promotion Management
**Status**: not_started
**Type**: testing
**Complexity**: medium
**Depends on**: Task 17, Task 18, Task 19

Test promotion creation, editing, deletion.

### Acceptance Criteria
- Create promotion works
- Edit promotion works
- Delete promotion works
- Ownership enforced
- Images uploaded correctly
- Geolocation works

### Sub-tasks
- [ ] Test promotion creation
- [ ] Test promotion editing
- [ ] Test promotion deletion
- [ ] Test ownership enforcement
- [ ] Test image upload
- [ ] Test geolocation

---

## Task 33: Integration Testing - Favorites
**Status**: not_started
**Type**: testing
**Complexity**: low
**Depends on**: Task 21, Task 22

Test favorites functionality.

### Acceptance Criteria
- Add to favorites works
- Remove from favorites works
- Favorites page shows correct items
- Duplicate prevention works
- User isolation enforced

### Sub-tasks
- [ ] Test add favorite
- [ ] Test remove favorite
- [ ] Test favorites page
- [ ] Test duplicate prevention
- [ ] Test user isolation

---

## Task 34: Integration Testing - Map
**Status**: not_started
**Type**: testing
**Complexity**: medium
**Depends on**: Task 20

Test map functionality.

### Acceptance Criteria
- Map displays correctly
- Markers show for promotions with coordinates
- Popup shows correct information
- Click navigation works
- Responsive layout works

### Sub-tasks
- [ ] Test map display
- [ ] Test marker display
- [ ] Test popup information
- [ ] Test click navigation
- [ ] Test responsive layout

---

## Task 35: End-to-End Testing - Consumer Flow
**Status**: not_started
**Type**: testing
**Complexity**: high
**Depends on**: Task 31, Task 32, Task 33, Task 34

Test complete consumer user journey.

### Acceptance Criteria
- Signup as consumer
- Login
- Browse promotions
- Filter by category
- View promotion detail
- Add to favorites
- View map
- View favorites

### Sub-tasks
- [ ] Test signup as consumer
- [ ] Test login
- [ ] Test browsing
- [ ] Test filtering
- [ ] Test detail view
- [ ] Test favorites
- [ ] Test map
- [ ] Test favorites page

---

## Task 36: End-to-End Testing - Establishment Flow
**Status**: not_started
**Type**: testing
**Complexity**: high
**Depends on**: Task 31, Task 32

Test complete establishment user journey.

### Acceptance Criteria
- Signup as establishment
- Login
- Create promotion with images
- Use geolocation
- Edit promotion
- Delete promotion
- View own promotions

### Sub-tasks
- [ ] Test signup as establishment
- [ ] Test login
- [ ] Test promotion creation
- [ ] Test image upload
- [ ] Test geolocation
- [ ] Test promotion editing
- [ ] Test promotion deletion

---

## Task 37: Performance Optimization
**Status**: not_started
**Type**: optimization
**Complexity**: medium
**Depends on**: Task 35, Task 36

Optimize frontend and backend performance.

### Acceptance Criteria
- Image lazy loading
- Component memoization
- Database indexes
- API response caching
- Bundle size optimized

### Sub-tasks
- [ ] Implement image lazy loading
- [ ] Add component memoization
- [ ] Verify database indexes
- [ ] Add response caching
- [ ] Optimize bundle size

---

## Task 38: Documentation
**Status**: not_started
**Type**: documentation
**Complexity**: low
**Depends on**: Task 1

Create project documentation.

### Acceptance Criteria
- README.md with setup instructions
- API documentation
- Component documentation
- Environment variables documented
- Deployment instructions

### Sub-tasks
- [ ] Create README.md
- [ ] Document API endpoints
- [ ] Document components
- [ ] Document environment setup
- [ ] Document deployment

---

## Task 39: Deployment Preparation
**Status**: not_started
**Type**: deployment
**Complexity**: medium
**Depends on**: Task 37, Task 38

Prepare for production deployment.

### Acceptance Criteria
- Frontend build optimized
- Backend build optimized
- Environment variables configured
- Database backups configured
- Error logging configured

### Sub-tasks
- [ ] Optimize frontend build
- [ ] Optimize backend build
- [ ] Configure environment
- [ ] Setup database backups
- [ ] Setup error logging

---

## Task 40: Final Testing and Launch
**Status**: not_started
**Type**: testing
**Complexity**: high
**Depends on**: Task 39

Final comprehensive testing before launch.

### Acceptance Criteria
- All features working
- No critical bugs
- Performance acceptable
- Security validated
- Ready for production

### Sub-tasks
- [ ] Run full test suite
- [ ] Manual testing
- [ ] Security review
- [ ] Performance testing
- [ ] Load testing
- [ ] Launch checklist
