# Multi-Portal System Documentation

## Overview

The Silver Maid Management System implements a comprehensive multi-portal authentication and authorization system supporting 6 distinct portals, each tailored for specific user roles and workflows.

---

## Portal Summary

| Portal | Role Level | Primary Color | Key Features |
|--------|------------|---------------|--------------|
| **Admin** | Super Admin, Admin | Blue | Full system control, HR, Finance, Reports |
| **Manager** | Manager | Indigo | Team oversight, Job management, Approvals |
| **Supervisor** | Supervisor | Emerald | Task management, Attendance, Quick approvals |
| **Employee** | User | Violet | Self-service, Attendance, Leave, Payslips |
| **Client** | Client | Green | Job tracking, Invoices, Support tickets |
| **Guest** | Guest | Gray | Read-only access, Announcements, Catalog |

---

## Authentication System

### Files Created

#### 1. Authentication Library
**File:** `/lib/auth.ts` (910 lines)

```typescript
// Key Types
type PortalType = 'admin' | 'manager' | 'supervisor' | 'employee' | 'client' | 'guest';
type RoleLevel = 'super' | 'admin' | 'manager' | 'supervisor' | 'user' | 'guest' | 'client';

// UserSession Interface
interface UserSession {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: RoleLevel;
  roleId: string;
  roleName: string;
  portal: PortalType;
  permissions: string[];
  department?: string;
  profileImage?: string;
  loginTime: Date;
  expiresAt: Date;
  ipAddress?: string;
}

// Key Functions
validateCredentials(portal: PortalType, email: string, password: string): Promise<AuthResponse>
storeSession(session: UserSession): void
getStoredSession(): UserSession | null
clearSession(): void
getDefaultPermissionsForRole(role: RoleLevel): string[]
```

### Demo Credentials

All portals use the same password format:
- **Password:** `Demo@123`
- **Email Pattern:** `{portal}@silvermaid.ae`

| Portal | Email | Password |
|--------|-------|----------|
| Admin | admin@silvermaid.ae | Demo@123 |
| Manager | manager@silvermaid.ae | Demo@123 |
| Supervisor | supervisor@silvermaid.ae | Demo@123 |
| Employee | employee@silvermaid.ae | Demo@123 |
| Client | client@homeware.ae | Demo@123 |
| Guest | guest@homeware.ae | Demo@123 |

---

## Portal Structure

### 1. Admin Portal

**Login:** `/login/admin`  
**Dashboard:** `/admin/dashboard`  
**Role Level:** Super Admin, Admin

**Modules (14 total):**
- Dashboard
- Employee Management
- HR Management
- Jobs Management
- Client Management
- Finance Management
- Reports & Analytics
- System Settings
- User Management
- Role Management
- Audit Logs
- Communications
- Asset Management
- Document Management

**Key Features:**
- Full system administration
- User and role management
- Complete financial oversight
- System configuration
- Audit trail access

---

### 2. Manager Portal

**Login:** `/login/manager`  
**Dashboard:** `/manager/dashboard`  
**Role Level:** Manager

**Modules (7 total):**
- Dashboard
- Team Management
- Jobs Overview
- Client Relations
- Reports
- Approvals
- Meetings

**Dashboard Sections:**
- Active Jobs with status and progress
- Pending Approvals (leave, expenses, overtime)
- Team Members with online status
- Upcoming Meetings schedule

**Key Features:**
- Team performance tracking
- Job assignment and monitoring
- Leave and expense approval
- Client relationship management
- Meeting scheduling

---

### 3. Supervisor Portal

**Login:** `/login/supervisor`  
**Dashboard:** `/supervisor/dashboard`  
**Role Level:** Supervisor

**Modules (5 total):**
- Dashboard
- Team Oversight
- Job Sites
- Approvals
- Reports

**Dashboard Sections:**
- Today's Tasks with progress tracking
- Team Attendance status
- Quick Approval actions
- Active Job Sites monitoring

**Key Features:**
- Real-time task management
- Attendance monitoring
- First-level approvals
- Job site supervision
- Performance reporting

---

### 4. Employee Portal

**Login:** `/login/employee`  
**Dashboard:** `/employee/dashboard`  
**Role Level:** User (Employee)

**Modules (8 total):**
- Dashboard
- My Profile
- Attendance
- Leave Requests
- Payslips
- My Jobs
- Requests
- Announcements

**Dashboard Sections:**
- Attendance card with check-in/out
- Leave balance (Annual, Sick, Personal)
- Assigned Jobs list
- Recent Payslips
- My Requests status
- Company Announcements

**Key Features:**
- Self-service attendance
- Leave request submission
- Payslip viewing
- Job assignment tracking
- Personal request management

---

### 5. Client Portal

**Login:** `/login/client`  
**Dashboard:** `/client/dashboard`  
**Role Level:** Client

**Modules (8 total):**
- Dashboard
- Our Services
- My Jobs
- Invoices
- Quotations
- Feedback
- Support
- My Account

**Dashboard Sections:**
- Summary stats (Active/Completed jobs, Quotations, Invoices)
- Active Jobs with progress bars
- Pending Quotations (Accept/Reject)
- Recent Invoices
- Recent Activity timeline

**Key Features:**
- Job tracking and updates
- Quotation review and approval
- Invoice access and payment
- Support ticket submission
- Feedback submission

---

### 6. Guest Portal

**Login:** `/login/guest`  
**Dashboard:** `/guest/dashboard`  
**Role Level:** Guest

**Modules (3 total):**
- Dashboard
- Announcements
- Service Catalog

**Dashboard Sections:**
- Guest notice (prompt to register)
- About Silver Maid (company info)
- Service Categories (6 categories)
- Latest Announcements
- Featured Products
- CTA Registration Banner

**Key Features:**
- Public information access
- Service catalog browsing
- Company announcements
- Limited read-only access
- Quick access without login

---

## Permission System

### Permission Categories

```typescript
type PermissionCategory = 
  | 'users' | 'roles' | 'departments' | 'employees' 
  | 'attendance' | 'leave' | 'payroll' | 'jobs' 
  | 'clients' | 'invoices' | 'quotations' | 'expenses' 
  | 'reports' | 'settings' | 'audit' | 'documents';
```

### Role-Based Permissions

| Role | Permissions Scope |
|------|-------------------|
| Super | All permissions (full CRUD on all resources) |
| Admin | All except super-admin specific |
| Manager | Team, Jobs, Clients, Reports, Approvals |
| Supervisor | Team read, Attendance, Jobs, Limited approvals |
| User | Own profile, Own attendance, Own leave, View jobs |
| Guest | View announcements, View services only |
| Client | Own jobs, Own invoices, Own quotations |

---

## File Structure

```
/app
├── login/
│   ├── page.tsx          # Main portal selection (updated)
│   ├── admin/page.tsx    # Admin login (updated)
│   ├── manager/page.tsx  # Manager login (new)
│   ├── supervisor/page.tsx # Supervisor login (new)
│   ├── employee/page.tsx # Employee login (new)
│   ├── client/page.tsx   # Client login (new)
│   └── guest/page.tsx    # Guest login (new)
├── admin/
│   └── dashboard/page.tsx  # Existing admin dashboard
├── manager/
│   └── dashboard/page.tsx  # Manager dashboard (new)
├── supervisor/
│   └── dashboard/page.tsx  # Supervisor dashboard (new)
├── employee/
│   └── dashboard/page.tsx  # Employee dashboard (new)
├── client/
│   └── dashboard/page.tsx  # Client dashboard (new)
└── guest/
    └── dashboard/page.tsx  # Guest dashboard (new)

/lib
└── auth.ts               # Authentication library (new)
```

---

## Database Schema

### New Tables (17 total)

| Table | Description |
|-------|-------------|
| `portals` | Portal definitions and configuration |
| `portal_modules` | Modules available in each portal |
| `portal_module_permissions` | Permission requirements per module |
| `role_portal_access` | Which roles can access which portals |
| `user_portal_access` | User-specific portal overrides |
| `user_sessions` | Active login sessions |
| `session_activity_log` | Activity within sessions |
| `portal_themes` | Theme customization per portal |
| `user_portal_preferences` | User preferences per portal |
| `portal_announcements` | Portal-specific announcements |
| `announcement_reads` | Announcement read tracking |
| `dashboard_widgets` | Available dashboard widgets |
| `user_dashboard_widgets` | User widget configurations |
| `portal_quick_actions` | Quick action buttons |
| `user_shortcuts` | User bookmark shortcuts |
| `portal_usage_stats` | Portal analytics (daily) |
| `module_usage_stats` | Module usage analytics |

See: `/DATABASE_SCHEMA_PORTAL_UPDATE.sql`

---

## Session Management

### Session Storage

Sessions are stored in localStorage with the key `silvermaid_session`:

```typescript
interface StoredSession {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: RoleLevel;
  roleId: string;
  roleName: string;
  portal: PortalType;
  permissions: string[];
  department?: string;
  profileImage?: string;
  loginTime: Date;
  expiresAt: Date;
}
```

### Session Validation

```typescript
// Check for valid session
const session = getStoredSession();
if (!session) {
  router.push('/login');
  return;
}

// Check expiration
if (new Date(session.expiresAt) < new Date()) {
  clearSession();
  router.push('/login');
  return;
}
```

---

## UI/UX Design

### Color Themes

| Portal | Primary | Gradient |
|--------|---------|----------|
| Admin | Blue | blue-500 to blue-700 |
| Manager | Indigo | indigo-500 to indigo-700 |
| Supervisor | Emerald | emerald-500 to emerald-700 |
| Employee | Violet | violet-500 to violet-700 |
| Client | Green | green-500 to green-700 |
| Guest | Gray | gray-500 to gray-700 |

### Common Components

All portals share:
- Dark theme (gray-900 background)
- Collapsible sidebar navigation
- Top header with user info
- Responsive grid layouts
- Consistent card styling
- Lucide React icons

---

## Build Information

```
✓ Compiled successfully in 10.5s
✓ Finished TypeScript in 27.8s
✓ Generating static pages (115/115)

Total Pages: 115
├── Static: 83 pages
├── Dynamic: 32 pages
└── API Routes: 0

New Portal Pages: 12
├── Login Pages: 6
└── Dashboard Pages: 6
```

---

## Future Enhancements

### Planned Features

1. **Route Protection Middleware**
   - Automatic redirect for unauthorized access
   - Role-based route guards

2. **API Authentication**
   - JWT token implementation
   - Refresh token rotation

3. **Portal Module Pages**
   - Create full module pages (not just dashboards)
   - Implement CRUD operations per module

4. **Real-time Features**
   - WebSocket notifications
   - Live attendance updates
   - Real-time chat

5. **Mobile Apps**
   - React Native employee app
   - Client self-service app

---

## Quick Reference

### Login URLs
- Main: `/login`
- Admin: `/login/admin`
- Manager: `/login/manager`
- Supervisor: `/login/supervisor`
- Employee: `/login/employee`
- Client: `/login/client`
- Guest: `/login/guest`

### Dashboard URLs
- Admin: `/admin/dashboard`
- Manager: `/manager/dashboard`
- Supervisor: `/supervisor/dashboard`
- Employee: `/employee/dashboard`
- Client: `/client/dashboard`
- Guest: `/guest/dashboard`

### Key Files
- Auth Library: `/lib/auth.ts`
- DB Schema: `/DATABASE_SCHEMA_PORTAL_UPDATE.sql`
- Documentation: `/MULTI_PORTAL_SYSTEM_DOCUMENTATION.md`

---

*Last Updated: February 2024*
*Version: 2.0.0*
