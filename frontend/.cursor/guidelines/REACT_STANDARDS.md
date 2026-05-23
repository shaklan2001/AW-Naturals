# ⚛️ React Industry Standards & Code Ethics
> **A complete reference for AI code editors and developers.**  
> Covers official React Rules, project structure, naming conventions, code ethics, performance, accessibility, testing, and best practices for writing world-class React code.

---

## Table of Contents

1. [Official Rules of React](#1-official-rules-of-react)
2. [Project File Structure](#2-project-file-structure)
3. [Naming Conventions](#3-naming-conventions)
4. [Component Architecture](#4-component-architecture)
5. [Hooks — Rules & Best Practices](#5-hooks--rules--best-practices)
6. [State Management](#6-state-management)
7. [Props & TypeScript](#7-props--typescript)
8. [Performance Optimization](#8-performance-optimization)
9. [Styling Standards](#9-styling-standards)
10. [Error Handling](#10-error-handling)
11. [Accessibility (a11y)](#11-accessibility-a11y)
12. [Testing Standards](#12-testing-standards)
13. [Code Ethics & Quality](#13-code-ethics--quality)
14. [Git & Version Control](#14-git--version-control)
15. [Security Best Practices](#15-security-best-practices)
16. [AI Code Editor Instructions](#16-ai-code-editor-instructions)

---

## 1. Official Rules of React

> Source: [react.dev/reference/rules](https://react.dev/reference/rules)  
> These are **rules**, not guidelines. Breaking them causes bugs and unpredictable behavior.

---

### 1.1 Components and Hooks Must Be Pure

**Components must be idempotent.**  
Always return the same output for the same props, state, and context.

```jsx
// ✅ CORRECT — Pure, predictable output
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

// ❌ WRONG — Side effect during render
function Greeting({ name }) {
  document.title = name; // NEVER do this during render
  return <h1>Hello, {name}</h1>;
}
```

**Side effects must run OUTSIDE of render.**  
Use `useEffect`, event handlers, or Server Actions — never inside the render body.

```jsx
// ✅ CORRECT — Side effect in useEffect
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
}

// ❌ WRONG — Side effect during render
function UserProfile({ userId }) {
  fetchUser(userId); // Called directly in render body
  return <div>...</div>;
}
```

**Props and state are immutable.**  
Never mutate props or state directly. Always create new objects/arrays.

```jsx
// ✅ CORRECT — Create a new array
setItems(prev => [...prev, newItem]);

// ❌ WRONG — Direct mutation
items.push(newItem);
setItems(items);

// ✅ CORRECT — Create new object
setUser(prev => ({ ...prev, name: 'Alice' }));

// ❌ WRONG — Direct object mutation
user.name = 'Alice';
setUser(user);
```

**Values are immutable after being passed to JSX.**

```jsx
// ✅ CORRECT — Mutation happens before JSX
const items = list.filter(x => x.active);
return <List items={items} />;

// ❌ WRONG — Mutating after passing to JSX
return <List items={list} onRender={() => list.splice(0, 1)} />;
```

---

### 1.2 React Calls Components and Hooks

**Never call component functions directly.**

```jsx
// ✅ CORRECT — Use in JSX
return <UserCard user={user} />;

// ❌ WRONG — Called as a plain function
return UserCard({ user }); // Bypasses React's rendering system
```

**Never pass hooks as regular values.**

```jsx
// ✅ CORRECT — Hook called inside component
function MyComponent() {
  const theme = useTheme();
  return <div style={{ color: theme.primary }}>...</div>;
}

// ❌ WRONG — Hook passed as a value
function MyComponent({ useData }) {
  const data = useData(); // Hook passed from outside — illegal
}
```

---

### 1.3 Rules of Hooks

**Only call Hooks at the top level.**  
Never inside loops, conditions, or nested functions.

```jsx
// ✅ CORRECT
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // ...
}

// ❌ WRONG — Hook inside condition
function Form({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState(''); // Breaks hook order!
  }
}

// ❌ WRONG — Hook inside loop
function List({ items }) {
  return items.map(item => {
    const [checked, setChecked] = useState(false); // Illegal!
    return <Item key={item.id} />;
  });
}
```

**Only call Hooks from React functions.**  
Hooks can only be called from React function components or other custom hooks.

```jsx
// ✅ CORRECT — Called from a component
function Timer() {
  const [count, setCount] = useState(0);
  // ...
}

// ✅ CORRECT — Called from a custom hook
function useCounter() {
  const [count, setCount] = useState(0);
  return count;
}

// ❌ WRONG — Called from a plain JS function
function helperFunction() {
  const [value] = useState(0); // Not a React function!
}
```

---

## 2. Project File Structure

Use **feature-based** folder organization for scalability. Group by feature/domain, not by type.

```
src/
├── app/                        # App-level config (router, providers, global styles)
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── assets/                     # Static files (images, fonts, icons)
│   ├── images/
│   └── fonts/
│
├── components/                 # Shared, reusable UI components
│   ├── ui/                     # Primitive UI (Button, Input, Modal, etc.)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   └── Input/
│   └── layout/                 # Layout components (Navbar, Sidebar, Footer)
│       ├── Navbar/
│       └── Footer/
│
├── features/                   # Feature modules (self-contained)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── index.ts            # Public API — only export what's needed
│   └── dashboard/
│       ├── components/
│       ├── hooks/
│       └── index.ts
│
├── hooks/                      # Shared custom hooks
│   ├── useDebounce.ts
│   ├── useFetch.ts
│   └── useLocalStorage.ts
│
├── lib/                        # Third-party library wrappers & config
│   ├── axios.ts
│   ├── queryClient.ts
│   └── i18n.ts
│
├── pages/                      # Route-level page components (thin, use features)
│   ├── Home/
│   ├── Dashboard/
│   └── NotFound/
│
├── services/                   # API calls, external service wrappers
│   ├── api.ts
│   └── userService.ts
│
├── store/                      # Global state (Zustand, Redux, Jotai, etc.)
│   ├── authStore.ts
│   └── uiStore.ts
│
├── styles/                     # Global styles, themes, tokens
│   ├── globals.css
│   ├── theme.ts
│   └── tokens.ts
│
├── types/                      # Global TypeScript types & interfaces
│   ├── api.ts
│   └── common.ts
│
└── utils/                      # Pure utility/helper functions
    ├── formatDate.ts
    ├── formatCurrency.ts
    └── validators.ts
```

### File Naming Rules

| Type | Convention | Example |
|------|-----------|---------|
| Component file | PascalCase | `UserCard.tsx` |
| Hook file | camelCase with `use` prefix | `useUserData.ts` |
| Utility file | camelCase | `formatDate.ts` |
| Type/Interface file | camelCase | `userTypes.ts` |
| Test file | Same name + `.test` | `UserCard.test.tsx` |
| Story file | Same name + `.stories` | `UserCard.stories.tsx` |
| Index file | Always lowercase | `index.ts` |
| CSS module | Same name + `.module.css` | `UserCard.module.css` |
| Constants file | UPPER_SNAKE_CASE or camelCase | `API_CONSTANTS.ts` |

---

## 3. Naming Conventions

### Components
```tsx
// ✅ PascalCase for components
function UserProfileCard() { ... }
const NavigationMenu = () => { ... };

// ❌ WRONG
function userProfileCard() { ... }
function user_profile_card() { ... }
```

### Props
```tsx
// ✅ camelCase for props
<UserCard firstName="John" isActive={true} onUserClick={handleClick} />

// ❌ WRONG
<UserCard first_name="John" IsActive={true} OnUserClick={handleClick} />
```

### Event Handlers
```tsx
// ✅ "handle" prefix for definitions, "on" prefix for props
const handleSubmit = () => { ... };
const handleUserClick = () => { ... };

<Button onClick={handleSubmit} />
<UserCard onSelect={handleUserClick} />
```

### Hooks
```tsx
// ✅ Always "use" prefix
function useWindowSize() { ... }
function useAuthStatus() { ... }

// ❌ WRONG
function getWindowSize() { ... } // Not a hook name
```

### Boolean Variables
```tsx
// ✅ Use "is", "has", "can", "should" prefixes
const isLoading = true;
const hasPermission = false;
const canEdit = user.role === 'admin';
const shouldRender = items.length > 0;

// ❌ WRONG
const loading = true;
const permission = false;
```

### Constants
```tsx
// ✅ SCREAMING_SNAKE_CASE for true constants
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// ✅ camelCase for module-level config objects
const defaultConfig = { timeout: 5000, retries: 3 };
```

---

## 4. Component Architecture

### One Component Per File
Each file should export one primary component. Keep related sub-components in the same file only if they are tightly coupled and not reused elsewhere.

### Component Structure Order
Follow this consistent order inside every component:

```tsx
// 1. Imports (external libs → internal absolute → relative)
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { UserAvatar } from './UserAvatar';

// 2. Types / Interfaces
interface UserCardProps {
  userId: string;
  onSelect?: (id: string) => void;
}

// 3. Constants (component-scoped)
const CACHE_TIME = 5 * 60 * 1000;

// 4. Component definition
export function UserCard({ userId, onSelect }: UserCardProps) {
  // 4a. Hooks (all at the top, no conditions)
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: user, isLoading } = useQuery({ queryKey: ['user', userId] });

  // 4b. Derived state / computed values
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Loading...';

  // 4c. Callbacks / handlers
  const handleClick = useCallback(() => {
    setIsExpanded(prev => !prev);
    onSelect?.(userId);
  }, [userId, onSelect]);

  // 4d. Effects
  useEffect(() => {
    if (user) document.title = displayName;
  }, [user, displayName]);

  // 4e. Early returns (loading, error, empty states)
  if (isLoading) return <Skeleton />;
  if (!user) return <EmptyState message="User not found" />;

  // 4f. Render
  return (
    <div className="user-card" onClick={handleClick}>
      <UserAvatar src={user.avatar} alt={displayName} />
      <span>{displayName}</span>
    </div>
  );
}
```

### Component Size Guidelines

| Size | Lines | Action |
|------|-------|--------|
| Small | < 80 lines | Perfect ✅ |
| Medium | 80–150 lines | Acceptable, consider splitting |
| Large | 150–250 lines | Split into sub-components |
| Too Large | > 250 lines | Must refactor immediately ❌ |

### Prefer Composition Over Inheritance

```tsx
// ✅ Composition pattern
function Card({ children, header, footer }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Usage
<Card
  header={<h2>Title</h2>}
  footer={<Button>Save</Button>}
>
  <p>Content here</p>
</Card>
```

---

## 5. Hooks — Rules & Best Practices

### Custom Hook Guidelines

```tsx
// ✅ Custom hook — encapsulates logic, reusable
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Always clean up!
  }, [value, delay]);

  return debouncedValue;
}
```

### useEffect Rules

```tsx
// ✅ Always include all dependencies
useEffect(() => {
  doSomething(userId, filter);
}, [userId, filter]); // Both deps listed

// ✅ Always return a cleanup function when needed
useEffect(() => {
  const subscription = subscribe(userId);
  return () => subscription.unsubscribe(); // Cleanup
}, [userId]);

// ❌ WRONG — Empty deps with internal references
useEffect(() => {
  fetchUser(userId); // userId used but not in deps
}, []); // Stale closure bug!

// ❌ WRONG — Missing cleanup
useEffect(() => {
  const id = setInterval(tick, 1000);
  // No return — memory leak!
}, []);
```

### useCallback & useMemo — When to Use

```tsx
// ✅ useMemo for expensive calculations
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// ✅ useCallback for stable function references passed to children
const handleDelete = useCallback(
  (id: string) => dispatch(deleteItem(id)),
  [dispatch]
);

// ❌ WRONG — Over-memoizing simple values
const name = useMemo(() => `${first} ${last}`, [first, last]); // Unnecessary
const handleClick = useCallback(() => setOpen(true), []); // No deps needed here either
```

### useRef Rules

```tsx
// ✅ useRef for DOM access
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// ✅ useRef for mutable values that don't trigger re-render
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

// ❌ WRONG — Using ref to store state that affects UI
const count = useRef(0);
count.current++; // Won't trigger re-render — use useState instead
```

---

## 6. State Management

### State Colocation — Keep State Close to Where It's Used

```tsx
// ✅ Local state if only one component needs it
function SearchBar() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// ✅ Lift state up when siblings need it
function Parent() {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <List onSelect={setSelected} />
      <Detail item={selected} />
    </>
  );
}

// ✅ Global state only for truly global data (auth, theme, cart)
const useAuthStore = create<AuthStore>(set => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### State Update Patterns

```tsx
// ✅ Always use functional update when new state depends on old state
setCount(prev => prev + 1);
setItems(prev => prev.filter(item => item.id !== id));

// ❌ WRONG — Stale state reference
setCount(count + 1); // May use stale count in async contexts

// ✅ Batch related state together
const [formState, setFormState] = useState({ name: '', email: '', age: 0 });
setFormState(prev => ({ ...prev, name: 'Alice' }));

// ❌ WRONG — Unnecessary separate useState for related values
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [age, setAge] = useState(0);
```

### Derived State — Don't Duplicate

```tsx
// ✅ Compute from existing state — don't sync state
function Cart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0); // Derived
  return <div>Total: ${total}</div>;
}

// ❌ WRONG — Duplicated state
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price, 0));
}, [items]); // Unnecessary sync
```

---

## 7. Props & TypeScript

### Always Type Props with TypeScript

```tsx
// ✅ Interface for props (preferred for extensibility)
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      aria-busy={isLoading}
    >
      {isLoading ? <Spinner /> : (children ?? label)}
    </button>
  );
}
```

### Avoid Prop Drilling Beyond 2 Levels

```tsx
// ✅ Use Context for deeply nested shared data
const ThemeContext = createContext<Theme>(defaultTheme);

function App() {
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

// Consume anywhere in the tree
function DeepChild() {
  const theme = useContext(ThemeContext);
  return <div style={{ color: theme.primary }}>...</div>;
}
```

### Spread Props Carefully

```tsx
// ✅ Explicit forwarding with rest props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, ...rest }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...rest} aria-invalid={!!error} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// ❌ WRONG — Blind prop spreading leaks internal concerns
function Button({ ...props }) {
  return <button {...props} />; // Could pass anything, including dangerous attributes
}
```

---

## 8. Performance Optimization

### Code Splitting with lazy() and Suspense

```tsx
// ✅ Split large pages/features
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### List Rendering — Always Use Stable Keys

```tsx
// ✅ Use unique, stable IDs as keys
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ❌ WRONG — Index as key (breaks on reorder/delete)
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}

// ❌ WRONG — Random key (remounts on every render)
{users.map(user => (
  <UserCard key={Math.random()} user={user} />
))}
```

### React.memo — Prevent Unnecessary Re-renders

```tsx
// ✅ Wrap components that render the same output for the same props
const UserAvatar = memo(function UserAvatar({ src, alt, size = 40 }) {
  return <img src={src} alt={alt} width={size} height={size} />;
});

// ✅ Custom comparison function when needed
const ListItem = memo(
  function ListItem({ item, onSelect }) {
    return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
  },
  (prev, next) => prev.item.id === next.item.id && prev.onSelect === next.onSelect
);
```

### Virtualization for Large Lists

```tsx
// ✅ Use virtualization for 100+ item lists
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={500}
      itemCount={items.length}
      itemSize={60}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ListItem item={items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

## 9. Styling Standards

### CSS Modules (Recommended Default)

```tsx
// UserCard.module.css
.card { border-radius: 8px; padding: 16px; }
.card--active { border: 2px solid var(--color-primary); }

// UserCard.tsx
import styles from './UserCard.module.css';
import clsx from 'clsx';

function UserCard({ isActive }) {
  return (
    <div className={clsx(styles.card, { [styles['card--active']]: isActive })}>
      ...
    </div>
  );
}
```

### Design Tokens

```ts
// styles/tokens.ts — Single source of truth
export const tokens = {
  colors: {
    primary: '#0070f3',
    error: '#ff0000',
    text: { primary: '#111', secondary: '#666' },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 16, full: 9999 },
  fontSize: { sm: 12, base: 16, lg: 20, xl: 24, '2xl': 32 },
};
```

### Avoid Inline Styles (except dynamic values)

```tsx
// ✅ CSS class for static styles
<div className="card-header">...</div>

// ✅ Inline only for truly dynamic values
<div style={{ width: `${progress}%` }}>...</div>

// ❌ WRONG — Static values inline
<div style={{ padding: '16px', borderRadius: '8px' }}>...</div>
```

---

## 10. Error Handling

### Error Boundaries

```tsx
// ✅ Every major feature/page should be wrapped
class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logErrorToService(error, info); // Report to Sentry, etc.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorUI />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<FeatureErrorPage />}>
  <ComplexFeature />
</ErrorBoundary>
```

### Async Error Handling

```tsx
// ✅ Always handle all async states
function UserList() {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <Skeleton count={5} />;
  if (isError) return <ErrorMessage message={error.message} onRetry={refetch} />;
  if (!data?.length) return <EmptyState message="No users found" />;

  return <ul>{data.map(user => <UserCard key={user.id} user={user} />)}</ul>;
}
```

---

## 11. Accessibility (a11y)

### Semantic HTML First

```tsx
// ✅ Use correct semantic elements
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
<button onClick={handleDelete}>Delete</button> // NOT <div onClick={...}>

// ❌ WRONG — div soup
<div onClick={handleDelete} className="button">Delete</div>
```

### ARIA Labels and Roles

```tsx
// ✅ Always provide accessible labels
<button aria-label="Close dialog" onClick={onClose}>
  <CloseIcon aria-hidden="true" />
</button>

<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
/>
{error && <span id="email-error" role="alert">{error}</span>}

// ✅ Images must have alt text
<img src={user.avatar} alt={`${user.name}'s profile picture`} />
<img src={decorativeBanner} alt="" /> // Empty alt for decorative images
```

### Keyboard Navigation

```tsx
// ✅ All interactive elements must be keyboard accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Custom Clickable
</div>

// ✅ Focus management for modals
useEffect(() => {
  if (isOpen) {
    firstFocusableRef.current?.focus();
  }
}, [isOpen]);
```

---

## 12. Testing Standards

### Testing Pyramid

```
         /\
        /e2e\       ← End-to-end (Playwright/Cypress) — few, slow
       /------\
      / integration\ ← Integration tests — moderate
     /-------------\
    /   unit tests   \ ← Unit tests (Vitest/Jest + RTL) — many, fast
   /------------------\
```

### React Testing Library Principles

```tsx
// ✅ Query by accessible roles and labels (NOT implementation details)
const { getByRole, getByLabelText, findByText } = render(<LoginForm />);

const emailInput = getByLabelText(/email/i);
const submitButton = getByRole('button', { name: /log in/i });

await userEvent.type(emailInput, 'user@example.com');
await userEvent.click(submitButton);

expect(await findByText(/welcome back/i)).toBeInTheDocument();

// ❌ WRONG — Testing implementation (class names, internal state)
expect(wrapper.state('isSubmitting')).toBe(true);
expect(container.querySelector('.btn-primary')).toBeTruthy();
```

### Test File Structure

```tsx
describe('UserCard', () => {
  // Arrange — shared setup
  const mockUser = { id: '1', name: 'Alice', avatar: '/img.jpg' };

  describe('when user data is provided', () => {
    it('renders the user name', () => {
      render(<UserCard user={mockUser} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('calls onSelect with user id when clicked', async () => {
      const onSelect = vi.fn();
      render(<UserCard user={mockUser} onSelect={onSelect} />);
      await userEvent.click(screen.getByRole('article'));
      expect(onSelect).toHaveBeenCalledWith('1');
    });
  });

  describe('when loading', () => {
    it('renders a skeleton', () => {
      render(<UserCard isLoading />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});
```

---

## 13. Code Ethics & Quality

### DRY — Don't Repeat Yourself

```tsx
// ✅ Extract repeated patterns into reusable components/hooks
function useFormField(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  return { value, error, setError, onChange };
}

// ❌ WRONG — Copy-pasted state + handler for each field
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const handleNameChange = (e) => setName(e.target.value);
const handleEmailChange = (e) => setEmail(e.target.value);
```

### KISS — Keep It Simple

```tsx
// ✅ Simple, readable code
const isAdult = age >= 18;
const greeting = isLoggedIn ? `Welcome, ${name}` : 'Please log in';

// ❌ WRONG — Unnecessarily complex
const isAdult = !(age < 18) ? true : false;
const greeting = !(!isLoggedIn) ? `Welcome, ${!false ? name : ''}` : 'Please log in';
```

### SOLID Principles in React

- **S — Single Responsibility**: Each component does one thing well
- **O — Open/Closed**: Components accept `children` and `className` for extension without modification
- **L — Liskov Substitution**: Custom components should work wherever base HTML elements work
- **I — Interface Segregation**: Keep prop interfaces small and focused; split large prop objects
- **D — Dependency Inversion**: Depend on abstractions (hooks, context) not concrete implementations

### Comment & Documentation Ethics

```tsx
// ✅ Comment WHY, not WHAT (code explains what, comments explain why)
// Delay is intentional: the animation requires 300ms to complete before focus
setTimeout(() => inputRef.current?.focus(), 300);

// ✅ Document complex business logic
// Per compliance requirement CR-104: user must explicitly confirm
// before any data deletion; silent deletions are prohibited.
const handleDelete = () => {
  setShowConfirmDialog(true);
};

// ❌ WRONG — Commenting obvious code
// Set the count to 0
setCount(0);

// ❌ WRONG — Commented-out dead code in production
// const oldHandler = () => { ... }
// const legacyLogic = doOldThing();
```

### Code Review Checklist (AI + Human)

- [ ] No direct state/prop mutations
- [ ] All hooks at top level, no conditional hooks
- [ ] useEffect has correct dependencies
- [ ] All async states handled (loading, error, empty, success)
- [ ] TypeScript — no `any` types
- [ ] No prop drilling beyond 2 levels
- [ ] All interactive elements are keyboard accessible
- [ ] Keys in lists are stable and unique
- [ ] No hardcoded magic numbers/strings (use constants)
- [ ] No unused imports or variables
- [ ] Components under 200 lines
- [ ] Tests cover happy path + edge cases

---

## 14. Git & Version Control

### Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

| Type | Use For |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that's neither fix nor feature |
| `style` | Formatting, missing semicolons (no logic change) |
| `test` | Adding or updating tests |
| `docs` | Documentation changes |
| `perf` | Performance improvement |
| `chore` | Build process, dependency updates |

**Examples:**
```
feat(auth): add Google OAuth login button
fix(cart): prevent duplicate items on rapid clicks
refactor(UserCard): extract avatar logic into useAvatar hook
test(Button): add keyboard navigation test cases
```

### Branch Naming

```
main              ← Production
develop           ← Integration branch
feature/user-auth
fix/cart-double-click
refactor/dashboard-cleanup
chore/update-deps
```

---

## 15. Security Best Practices

### Avoid dangerouslySetInnerHTML

```tsx
// ❌ DANGER — XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Use a sanitization library if HTML rendering is truly needed
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ✅ Even better — render as text, never raw HTML from user input
<p>{userInput}</p>
```

### Environment Variables

```tsx
// ✅ Public vars exposed to browser — only non-sensitive data
const apiUrl = import.meta.env.VITE_API_URL;

// ❌ NEVER put secrets in VITE_ / NEXT_PUBLIC_ env vars
// These are bundled into the browser!
const secretKey = import.meta.env.VITE_SECRET_KEY; // ❌ Exposed!
```

### Input Validation

```tsx
// ✅ Always validate and sanitize before sending to API
const handleSubmit = async (formData: FormData) => {
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    setErrors(result.error.flatten().fieldErrors);
    return;
  }
  await submitToApi(result.data); // Only submit validated data
};
```

---

## 16. AI Code Editor Instructions

> These rules are specifically for AI assistants (Copilot, Claude, Cursor, etc.) generating React code.

### ALWAYS Do

- ✅ Add TypeScript types to all props, state, and function signatures
- ✅ Use named exports for components (not default exports)
- ✅ Destructure props at function signature level
- ✅ Handle all async states: loading, error, empty, success
- ✅ Add `key` props to all list items using stable, unique IDs
- ✅ Provide `aria-label` on all icon buttons and interactive elements
- ✅ Include cleanup functions in `useEffect` when subscribing/timing
- ✅ Use functional state updates when state depends on previous state
- ✅ Place all hook calls at the top of the component, before conditions
- ✅ Use `const` for all variables; `let` only inside functions where reassignment is needed
- ✅ Use optional chaining (`?.`) and nullish coalescing (`??`) safely
- ✅ Add JSDoc comments to all custom hooks and utility functions

### NEVER Do

- ❌ Use `any` type in TypeScript
- ❌ Use array index as React `key`
- ❌ Call hooks inside conditions, loops, or nested functions
- ❌ Mutate props or state directly
- ❌ Use `dangerouslySetInnerHTML` without sanitization
- ❌ Leave empty `catch` blocks
- ❌ Use `useEffect` for state synchronization (derive instead)
- ❌ Create components inside other component's render function
- ❌ Use `var` keyword
- ❌ Nest ternary operators more than one level deep
- ❌ Forget to handle the `null`/`undefined` cases

### Code Generation Template

When generating a new React component, always follow this skeleton:

```tsx
import { useState, useEffect, useCallback } from 'react';

// ---- Types ----
interface ComponentNameProps {
  // required props
  // optional?: props
}

// ---- Component ----
export function ComponentName({ prop1, prop2 = 'default' }: ComponentNameProps) {
  // 1. Hooks
  // 2. Derived values
  // 3. Handlers
  // 4. Effects
  // 5. Early returns (loading, error, empty)
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---

## Quick Reference Card

| Rule | ✅ Do | ❌ Don't |
|------|-------|---------|
| **Purity** | Same input → same output | Side effects in render |
| **State** | `setState(prev => ...)` | `state.push()` / mutate directly |
| **Hooks** | Top-level only | Inside conditions/loops |
| **Keys** | Stable unique IDs | Array index / Math.random() |
| **Types** | Always type props | Use `any` |
| **a11y** | Semantic HTML + ARIA | Div/span for buttons/links |
| **Effects** | Include all deps + cleanup | Missing deps / no cleanup |
| **Components** | < 200 lines, one purpose | 500+ line god components |
| **Secrets** | Server-side env vars | Browser-exposed secrets |
| **Comments** | Explain WHY | Comment obvious WHAT |

---

*Last updated: 2026 | Based on React 19 | [Official React Rules](https://react.dev/reference/rules)*
