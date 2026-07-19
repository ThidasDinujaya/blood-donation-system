# Blood Donation System - Comprehensive Technical Documentation

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Backend Microservices](#backend-microservices)
   - [User Service (Port 8081)](#user-service-port-8081)
   - [Campaign Service (Port 8082)](#campaign-service-port-8082)
   - [Inventory Service (Port 8083)](#inventory-service-port-8083)
   - [Emergency Request Service (Port 8084)](#emergency-request-service-port-8084)
   - [Notification Service (Port 8085)](#notification-service-port-8085)
3. [API Gateway (Port 8080)](#api-gateway-port-8080)
4. [Frontend Application (Port 3000)](#frontend-application-port-3000)
5. [Database Architecture](#database-architecture)
6. [REST API Endpoints](#rest-api-endpoints)
7. [Annotations Explained](#annotations-explained)
8. [Component Interactions](#component-interactions)
9. [Impact of Code Changes](#impact-of-code-changes)

---

## System Architecture Overview

The Blood Donation System is a **microservices-based application** built with:
- **Backend**: Spring Boot (Java)
- **Frontend**: React (JavaScript)
- **API Gateway**: Spring Cloud Gateway
- **Database**: MySQL (relational database)
- **Architecture Pattern**: RESTful API with microservices

### Architecture Diagram
```
┌─────────────┐
│   Frontend  │ (React - Port 3000)
│   (Vite)    │
└──────┬──────┘
       │ HTTP Requests
       ↓
┌─────────────┐
│ API Gateway │ (Spring Cloud Gateway - Port 8080)
│  (Routing)  │
└──────┬──────┘
       │ Routes to Services
       ├──────────────────────────────────┐
       ↓                                  ↓
┌──────────────┐              ┌──────────────┐
│ User Service │              │Campaign Svc  │
│   (8081)     │              │   (8082)     │
└──────────────┘              └──────────────┘
       ↓                                  ↓
┌──────────────┐              ┌──────────────┐
│bloodbank_    │              │campaign_db   │
│users DB      │              │              │
└──────────────┘              └──────────────┘

       ↓                                  ↓
┌──────────────┐              ┌──────────────┐
│Inventory Svc │              │Emergency Svc │
│   (8083)     │              │   (8084)     │
└──────────────┘              └──────────────┘
       ↓                                  ↓
┌──────────────┐              ┌──────────────┐
│bloodinventory│              │request_db    │
│db            │              │              │
└──────────────┘              └──────────────┘

       ↓
┌──────────────┐
│Notification  │
│  Svc (8085)  │
└──────────────┘
```

### Key Design Principles
1. **Microservices**: Each service handles a specific domain
2. **RESTful APIs**: All endpoints follow REST conventions
3. **Plural Nouns**: All resource names are plural (e.g., `/users`, `/campaigns`)
4. **Query Parameters**: Filtering, sorting, pagination use query strings
5. **Action-Based Routes**: Non-CRUD operations use verb-based endpoints (e.g., `/checkemail`)
6. **Role-Based Access Control**: Three main roles - ADMIN, USER (DONOR), HOSPITAL

---

## Backend Microservices

### User Service (Port 8081)

**Purpose**: Manages user accounts, authentication, and user-related operations.

#### Application Entry Point

**File**: `UserServiceApplication.java`

```java
@SpringBootApplication
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

**Annotations Explained**:
- `@SpringBootApplication`: Combines three annotations:
  - `@Configuration`: Marks class as configuration source
  - `@EnableAutoConfiguration`: Enables Spring Boot's auto-configuration
  - `@ComponentScan`: Scans for Spring components in the package

**What it does**: Starts the Spring Boot application, initializes the Spring context, and begins the embedded Tomcat server.

**If removed**: Application won't start. No entry point for JVM.

**If added extra code**: Adding code before `SpringApplication.run()` would execute before Spring context initialization.

---

#### Configuration

**File**: `application.properties`

```properties
spring.application.name=user-service
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/bloodbank_users?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.sql.init.mode=always
logging.level.org.springframework.web=INFO
logging.level.org.hibernate.SQL=DEBUG
```

**Properties Explained**:
- `spring.application.name`: Service identification for service discovery
- `server.port=8081`: Embedded Tomcat listens on this port
- `spring.datasource.url`: JDBC connection string to MySQL database
  - `createDatabaseIfNotExist=true`: Auto-creates database if missing
- `spring.jpa.hibernate.ddl-auto=update`: Automatically updates database schema
  - **Values**: `none`, `validate`, `update`, `create`, `create-drop`
  - **Impact of `update`**: Adds new columns/tables without deleting existing data
  - **If changed to `create`**: Would drop and recreate tables on startup (data loss!)
  - **If changed to `none`**: No schema changes (manual schema management required)
- `spring.jpa.show-sql=true`: Logs SQL statements to console for debugging
- `spring.sql.init.mode=always`: Always executes `data.sql` on startup
  - **If removed**: `data.sql` won't execute (admin user won't be created)
  - **If changed to `never`**: Never executes initialization scripts

---

#### Data Models

**File**: `User.java`

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role; // ROLE_ADMIN, ROLE_USER, ROLE_HOSPITAL

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "city")
    private String city;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "hospital_name")
    private String hospitalName;

    @Column(name = "available_to_donate")
    private boolean availableToDonate;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    // Getters and Setters...
}
```

**Annotations Explained**:
- `@Entity`: Marks class as JPA entity (maps to database table)
  - **If removed**: JPA won't recognize this as a persistent class
- `@Table(name = "users")`: Specifies table name
  - **If removed**: Default table name would be `user` (class name lowercase)
- `@Id`: Marks field as primary key
  - **If removed**: JPA won't know which field is the primary key (error)
- `@GeneratedValue(strategy = GenerationType.IDENTITY)`: Auto-increment primary key
  - **Strategies**: `IDENTITY` (database), `SEQUENCE`, `TABLE`, `AUTO`
  - **If removed**: Must manually set ID before saving
- `@Column(name = "first_name")`: Maps field to database column
  - **If removed**: Default column name would be `firstName` (camelCase)
- `@Column(unique = true)`: Enforces uniqueness constraint
  - **If removed**: Multiple users could have same email (data integrity issue)

**Relationships**: This entity has no explicit relationships to other entities. All cross-service relationships are handled via IDs (foreign keys conceptually, but not enforced by JPA).

---

#### Repository Layer

**File**: `UserRepository.java`

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByBloodGroup(String bloodGroup);
    List<User> findByBloodGroupAndCityAndAvailableToDonateTrue(String bloodGroup, String city);
    
    @Query("SELECT new com.nibm.bloodbank.userservice.Data.BloodGroupCount(u.bloodGroup, COUNT(u)) FROM User u GROUP BY u.bloodGroup")
    List<BloodGroupCount> countUsersByBloodGroup();
    
    @Query("SELECT u FROM User u WHERE " +
           "(:city IS NULL OR u.city = :city) AND " +
           "(:bloodGroup IS NULL OR u.bloodGroup = :bloodGroup) AND " +
           "(:availableToDonate IS NULL OR u.availableToDonate = :availableToDonate) AND " +
           "(:role IS NULL OR u.role = :role)")
    List<User> findByCriteria(String city, String bloodGroup, Boolean availableToDonate, String role);
}
```

**Annotations Explained**:
- `@Repository`: Marks interface as Spring Data repository
  - **If removed**: Spring won't create proxy implementation at runtime
- `extends JpaRepository<User, Long>`: Inherits CRUD operations
  - **Generic parameters**: Entity type, Primary key type
  - **Inherited methods**: `save()`, `findById()`, `findAll()`, `deleteById()`, etc.
  - **If changed to `CrudRepository`**: Loses pagination support
- `@Query`: Custom JPQL query
  - **If removed**: Method would use Spring Data query derivation (if possible)
  - **Impact**: Complex queries require `@Query` annotation

**Method Naming Convention** (Spring Data Query Derivation):
- `findByEmail` → `SELECT u FROM User u WHERE u.email = ?1`
- `findByBloodGroupAndCity` → `SELECT u FROM User u WHERE u.bloodGroup = ?1 AND u.city = ?2`
- **If method name is wrong**: Spring Data won't understand, throws exception at startup

**What happens if repository is removed**:
- Service layer has no data access
- All database operations fail
- Application may still start but all API calls fail

---

#### Service Layer

**File**: `UserService.java`

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public AuthResponse registerUser(User user) {
        // Validation logic
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new AuthResponse("Email already registered", false);
        }
        user.setRole(user.getRole() != null ? user.getRole() : "ROLE_USER");
        User savedUser = userRepository.save(user);
        return new AuthResponse("Registration successful", true, savedUser.getId(), savedUser.getRole());
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return new AuthResponse("User not found", false);
        }
        User user = userOpt.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse("Invalid password", false);
        }
        return new AuthResponse("Login successful", true, user.getId(), user.getRole());
    }

    public List<User> getEligibleDonors(String bloodGroup, String city) {
        return userRepository.findByBloodGroupAndCityAndAvailableToDonateTrue(bloodGroup, city);
    }

    public List<User> findUsers(String city, String bloodGroup, Boolean availableToDonate, String role) {
        return userRepository.findByCriteria(city, bloodGroup, availableToDonate, role);
    }

    public List<BloodGroupCount> getBloodGroupCounts() {
        return userRepository.countUsersByBloodGroup();
    }

    // Other methods...
}
```

**Annotations Explained**:
- `@Service`: Marks class as service layer component
  - **If removed**: `@Autowired` won't work, manual bean creation needed
- `@Autowired`: Dependency injection
  - **If removed**: Must use constructor injection or manual instantiation
  - **Impact**: Tight coupling, difficult to test

**Business Logic**:
1. **Registration**: Checks for existing email, sets default role, saves user
2. **Authentication**: Validates email and password (plaintext - not production-ready)
3. **Eligible Donors**: Finds donors matching blood group, city, and availability
4. **Criteria Search**: Flexible search with optional parameters

**What happens if service logic is removed**:
- Controllers would have to contain business logic (violates separation of concerns)
- Code becomes harder to test and maintain
- Business rules scattered across controllers

---

#### Controller Layer

**File**: `AuthController.java`

```java
@RestController
@RequestMapping(path = "/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return userService.authenticateUser(request);
    }

    @DeleteMapping("/logout")
    public AuthResponse logout() {
        return new AuthResponse("Logout successful", true);
    }

    @GetMapping("/checkemail")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean isRegistered = userService.isEmailRegistered(email);
        return Collections.singletonMap("isRegistered", isRegistered);
    }
}
```

**Annotations Explained**:
- `@RestController`: Combines `@Controller` + `@ResponseBody`
  - **If changed to `@Controller`**: Must add `@ResponseBody` to each method
  - **Impact**: Methods would return view names instead of JSON
- `@RequestMapping(path = "/api/auth")`: Base path for all endpoints
  - **If removed**: Each endpoint would need full path
  - **Impact**: `/register` becomes `/api/auth/register` vs just `/register`
- `@PostMapping("/register")`: Maps HTTP POST to this method
  - **HTTP Methods**: `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping`
  - **If wrong method used**: Browser/clients can't call endpoint correctly
- `@RequestBody`: Binds HTTP request body to method parameter
  - **If removed**: Parameter would be null (no data binding)
  - **Impact**: Can't receive JSON data from client
- `@RequestParam`: Binds query parameter to method parameter
  - **If removed**: Parameter would be null
  - **Impact**: Can't receive query string parameters

**REST Compliance**:
- `/api/auth/register` - POST for creating resource (user)
- `/api/auth/login` - POST for authentication (action-based)
- `/api/auth/logout` - DELETE for session termination (action-based)
- `/api/auth/checkemail` - GET for checking email existence (action-based)

**What happens if controller is removed**:
- No HTTP endpoints exposed
- Frontend cannot communicate with service
- Service still runs but serves no requests

---

**File**: `UserController.java`

```java
@RestController
@RequestMapping(path = "/api")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> getAllUsers(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) Boolean availableToDonate,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String eligibleDonors) {
        if (eligibleDonors != null && eligibleDonors.equals("true")) {
            return userService.getEligibleDonors(bloodGroup, city);
        }
        return userService.findUsers(city, bloodGroup, availableToDonate, role);
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id).orElse(null);
    }

    @PutMapping("/users/{id}")
    public AuthResponse updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUserProfile(id, user.getFirstName(), user.getLastName(),
                user.getHospitalName(), user.getPhoneNumber(), user.getCity(),
                user.getBloodGroup(), user.getAvailableToDonate(), user.getLastDonationDate());
    }

    @DeleteMapping("/users/{id}")
    public AuthResponse deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    @GetMapping("/users/me")
    public User getCurrentUser(@RequestParam String email) {
        return userService.getUserByEmail(email).orElse(null);
    }

    @PutMapping("/users/me/password")
    public AuthResponse changePassword(@RequestParam String email,
                                        @RequestParam String oldPassword,
                                        @RequestParam String newPassword) {
        return userService.changePassword(email, oldPassword, newPassword);
    }
}
```

**Annotations Explained**:
- `@PathVariable`: Binds URI template variable to method parameter
  - **Example**: `/users/{id}` → `id` parameter gets value from URL
  - **If removed**: Parameter would be null
  - **Impact**: Can't access dynamic URL segments
- `@RequestParam(required = false)`: Optional query parameter
  - **If `required = true` (default)**: Client must provide parameter or gets 400 error
  - **Impact**: Flexibility in filtering

**REST Compliance**:
- `/api/users` - GET with query parameters for filtering (plural noun)
- `/api/users/{id}` - GET for single resource
- `/api/users/{id}` - PUT for updating resource
- `/api/users/{id}` - DELETE for removing resource
- `/api/users/me` - GET for current user (action-based)
- `/api/users/me/password` - PUT for password change (action-based)

**What happens if duplicate endpoints exist**:
- Spring Boot startup fails with "Ambiguous mapping" error
- Must ensure each path + HTTP method combination is unique

---

**File**: `StatsController.java`

```java
@RestController
@RequestMapping(path = "/api/stats")
public class StatsController {
    @Autowired
    private UserService userService;

    @GetMapping("/users/bloodgroups")
    public List<BloodGroupCount> getUsersCountByBloodGroup() {
        return userService.getBloodGroupCounts();
    }
}
```

**Purpose**: Provides statistical data about users (e.g., blood group distribution).

**What happens if removed**:
- Frontend cannot display blood group statistics
- No impact on core functionality

---

#### Data Transfer Objects (DTOs)

**File**: `AuthRequest.java`

```java
public class AuthRequest {
    private String email;
    private String password;
    // Getters and Setters...
}
```

**Purpose**: Encapsulates authentication request data.

**If removed**: Controller would need to accept raw parameters instead of object.

---

**File**: `AuthResponse.java`

```java
public class AuthResponse {
    private String message;
    private boolean success;
    private Long userId;
    private String role;
    // Constructors, Getters, Setters...
}
```

**Purpose**: Standardized response format for authentication operations.

**If removed**: Each endpoint would return different response formats (inconsistent API).

---

**File**: `BloodGroupCount.java`

```java
public class BloodGroupCount {
    private String bloodGroup;
    private long count;
    // Constructor, Getters, Setters...
}
```

**Purpose**: DTO for aggregated blood group statistics.

**If removed**: Would need to return raw query results or custom JSON.

---

### Campaign Service (Port 8082)

**Purpose**: Manages blood donation campaigns and appointment bookings.

#### Application Entry Point

**File**: `CampaignServiceApplication.java`

Same structure as UserServiceApplication.

---

#### Configuration

**File**: `application.properties`

```properties
spring.application.name=campaign-service
server.port=8082
spring.datasource.url=jdbc:mysql://localhost:3306/campaign_db
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Database**: Separate database `campaign_db` for campaign-related data.

---

#### Data Models

**File**: `Campaign.java`

```java
@Entity
@Table(name = "campaigns")
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "location")
    private String location;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "organizer")
    private String organizer;

    @Column(name = "max_donors")
    private int maxDonors;

    @Column(name = "description")
    private String description;
    // Getters and Setters...
}
```

**Data Types**:
- `LocalDate`: Date without time (e.g., 2025-01-15)
- `LocalTime`: Time without date (e.g., 09:00)
- **If changed to `Date`**: Would include timezone information (more complex)

**Business Rules**:
- `maxDonors`: Maximum number of donors that can book
- **If removed**: No limit on bookings (could overflow venue capacity)

---

**File**: `Appointment.java`

```java
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "campaign_id")
    private int campaignId;

    @Column(name = "donor_id")
    private int donorId;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "time_slot")
    private String timeSlot;

    @Column(name = "status")
    private String status; // PENDING, CONFIRMED, CANCELLED, COMPLETED
    // Getters and Setters...
}
```

**Relationships**:
- `campaignId`: Foreign key to Campaign table (logical, not enforced)
- `donorId`: Foreign key to User table (logical, not enforced)
- **If enforced with `@ManyToOne`**: Would require User and Campaign entities in same service
- **Current design**: Loose coupling via IDs (microservices pattern)

**Status Values**:
- `PENDING`: Initial booking request
- `CONFIRMED`: Booking approved
- `CANCELLED`: Booking cancelled
- `COMPLETED`: Donation completed

---

#### Repository Layer

**File**: `CampaignRepository.java`

```java
@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer> {
    List<Campaign> findByDateGreaterThanEqual(LocalDate date);
    List<Campaign> findByLocationContaining(String location);
    List<Campaign> findByDate(LocalDate date);
}
```

**Query Methods**:
- `findByDateGreaterThanEqual`: Finds campaigns on or after given date (upcoming campaigns)
- `findByLocationContaining`: Case-insensitive partial match on location
- **If method name wrong**: Spring Data throws exception at startup

---

**File**: `AppointmentRepository.java`

```java
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByCampaignId(int campaignId);
    List<Appointment> findByDonorId(int donorId);
    Appointment findByCampaignIdAndAppointmentDateAndTimeSlot(int campaignId, LocalDate appointmentDate, String timeSlot);
    List<Appointment> findByStatus(String status);
    List<Appointment> findByCampaignIdAndDonorId(int campaignId, int donorId);
}
```

**Business Logic in Repository**:
- `findByCampaignIdAndDonorId`: Prevents duplicate bookings for same campaign
- **If removed**: Service layer would need to filter manually

---

#### Service Layer

**File**: `CampaignService.java`

```java
@Service
public class CampaignService {
    @Autowired
    private CampaignRepository campaignRepo;

    public List<Campaign> getAllCampaigns() {
        return campaignRepo.findAll();
    }

    public Campaign getCampaignById(int id) {
        return campaignRepo.findById(id).orElse(null);
    }

    public Campaign createCampaign(Campaign campaign) {
        return campaignRepo.save(campaign);
    }

    public Campaign updateCampaign(Campaign campaign) {
        return campaignRepo.save(campaign);
    }

    public void deleteCampaign(int id) {
        campaignRepo.deleteById(id);
    }

    public List<Campaign> getUpcomingCampaigns() {
        return campaignRepo.findByDateGreaterThanEqual(LocalDate.now());
    }

    public List<Campaign> getCampaignsByLocation(String location) {
        return campaignRepo.findByLocationContaining(location);
    }
}
```

**What happens if validation is removed**:
- Invalid campaigns could be saved (e.g., negative maxDonors)
- **Should add**: Validation annotations or manual validation

---

**File**: `AppointmentService.java`

```java
@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepo;
    @Autowired
    private CampaignRepository campaignRepo;

    public Appointment createAppointment(Appointment appointment) {
        // Get campaign details to fill in missing date and time slot
        Campaign campaign = campaignRepo.findById(appointment.getCampaignId()).orElse(null);
        if (campaign != null) {
            if (appointment.getAppointmentDate() == null) {
                appointment.setAppointmentDate(campaign.getDate());
            }
            if (appointment.getTimeSlot() == null || appointment.getTimeSlot().isEmpty()) {
                appointment.setTimeSlot(campaign.getStartTime().toString());
            }

            // 1. Check if donor already has an appointment for this campaign
            List<Appointment> donorAppointments = appointmentRepo.findByCampaignIdAndDonorId(
                appointment.getCampaignId(), appointment.getDonorId());
            if (!donorAppointments.isEmpty()) {
                throw new IllegalStateException("You already have an appointment for this campaign");
            }

            // 2. Check if maxDonors limit has been reached
            List<Appointment> campaignAppointments = appointmentRepo.findByCampaignId(appointment.getCampaignId());
            if (campaignAppointments.size() >= campaign.getMaxDonors()) {
                throw new IllegalStateException("This campaign has reached the maximum number of donors");
            }
        }

        return appointmentRepo.save(appointment);
    }

    // Other methods...
}
```

**Business Rules**:
1. **Auto-fill defaults**: Uses campaign date/time if not provided
2. **Duplicate prevention**: One appointment per donor per campaign
3. **Capacity limit**: Cannot exceed `maxDonors`

**What happens if business rules removed**:
- Donors could book multiple times for same campaign
- Campaigns could exceed capacity
- **Impact**: Overbooking, poor user experience

---

#### Controller Layer

**File**: `CampaignController.java`

```java
@RestController
@RequestMapping(path = "/api/campaigns")
public class CampaignController {
    @Autowired
    private CampaignService campaignService;

    @GetMapping
    public List<Campaign> getAllCampaigns() {
        return campaignService.getAllCampaigns();
    }

    @GetMapping("/{id}")
    public Campaign getCampaignById(@PathVariable int id) {
        return campaignService.getCampaignById(id);
    }

    @PostMapping
    public Campaign createCampaign(@RequestBody Campaign campaign) {
        return campaignService.createCampaign(campaign);
    }

    @PutMapping("/{id}")
    public Campaign updateCampaign(@PathVariable int id, @RequestBody Campaign campaign) {
        return campaignService.updateCampaign(campaign);
    }

    @DeleteMapping("/{id}")
    public void deleteCampaign(@PathVariable int id) {
        campaignService.deleteCampaign(id);
    }
}
```

**REST Compliance**:
- `/api/campaigns` - GET all, POST create
- `/api/campaigns/{id}` - GET one, PUT update, DELETE remove

---

**File**: `AppointmentController.java`

```java
@RestController
@RequestMapping(path = "/api/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable int id) {
        return appointmentService.getAppointmentById(id);
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @PutMapping("/{id}")
    public Appointment updateAppointment(@PathVariable int id, @RequestBody Appointment appointment) {
        return appointmentService.updateAppointment(appointment);
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable int id) {
        appointmentService.deleteAppointment(id);
    }

    @GetMapping("/campaign/{campaignId}")
    public List<Appointment> getAppointmentsByCampaign(@PathVariable int campaignId) {
        return appointmentService.getAppointmentsByCampaign(campaignId);
    }

    @GetMapping("/donor/{donorId}")
    public List<Appointment> getAppointmentsByDonor(@PathVariable int donorId) {
        return appointmentService.getAppointmentsByDonor(donorId);
    }

    @GetMapping("/count/campaign/{campaignId}")
    public Map<String, Integer> getAppointmentCountByCampaign(@PathVariable int campaignId) {
        int count = appointmentService.getAppointmentsByCampaign(campaignId).size();
        return Collections.singletonMap("count", count);
    }

    @GetMapping("/check/{campaignId}/{donorId}")
    public Map<String, Boolean> checkDonorAppointmentExists(
            @PathVariable int campaignId, @PathVariable int donorId) {
        boolean exists = appointmentService.hasDonorAppointmentForCampaign(campaignId, donorId);
        return Collections.singletonMap("exists", exists);
    }
}
```

**Special Endpoints**:
- `/count/campaign/{campaignId}` - Returns count of appointments for a campaign
- `/check/{campaignId}/{donorId}` - Checks if donor has appointment for campaign
- **If removed**: Frontend would need to fetch all appointments and count manually (inefficient)

---

### Inventory Service (Port 8083)

**Purpose**: Manages blood inventory across blood banks.

#### Configuration

**File**: `application.properties`

```properties
spring.application.name=inventory-service
server.port=8083
spring.datasource.url=jdbc:mysql://localhost/bloodinventorydb
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

**Database**: `bloodinventorydb` for inventory data.

---

#### Data Model

**File**: `BloodInventory.java`

```java
@Entity
@Table(name = "blood_inventory")
public class BloodInventory {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "units_available")
    private int unitsAvailable;

    @Column(name = "blood_bank_name")
    private String bloodBankName;

    @Column(name = "location")
    private String location;

    @Column(name = "expiry_date")
    private String expiryDate;
    // Getters and Setters...
}
```

**Data Types**:
- `expiryDate` as `String`: Should be `LocalDate` for proper date handling
- **If changed to `LocalDate`**: Better date validation and formatting

---

#### Repository Layer

**File**: `BloodInventoryRepository.java`

```java
@Repository
public interface BloodInventoryRepository extends JpaRepository_BloodInventory, Integer_ {
    @Query("SELECT b FROM BloodInventory b WHERE b.bloodGroup = ?1")
    public List<BloodInventory> getInventoryByBloodGroup(String bloodGroup);
}
```

**Custom Query**:
- Uses JPQL to filter by blood group
- **If removed**: Could use method name `findByBloodGroup`

---

#### Service Layer

**File**: `BloodInventoryService.java`

```java
@Service
public class BloodInventoryService {
    @Autowired
    private BloodInventoryRepository inventoryRepo;

    public List<BloodInventory> getAllInventory() {
        return inventoryRepo.findAll();
    }

    public BloodInventory getInventoryById(int id) {
        Optional<BloodInventory> inventory = inventoryRepo.findById(id);
        if (inventory.isPresent()) {
            return inventory.get();
        }
        return null;
    }

    public List<BloodInventory> getInventoryByBloodGroup(String bloodGroup) {
        return inventoryRepo.getInventoryByBloodGroup(bloodGroup);
    }

    public BloodInventory createInventory(BloodInventory inventory) {
        return inventoryRepo.save(inventory);
    }

    public BloodInventory updateInventory(int id, BloodInventory inventory) {
        inventory.setId(id);
        return inventoryRepo.save(inventory);
    }

    public void deleteInventoryById(int id) {
        inventoryRepo.deleteById(id);
    }

    public BloodInventory reserveUnits(String bloodGroup, int units) {
        List<BloodInventory> matches = inventoryRepo.getInventoryByBloodGroup(bloodGroup);

        for (BloodInventory item : matches) {
            if (item.getUnitsAvailable() >= units) {
                item.setUnitsAvailable(item.getUnitsAvailable() - units);
                return inventoryRepo.save(item);
            }
        }
        return null;
    }
}
```

**Business Logic**:
- `reserveUnits`: Finds inventory with sufficient units and deducts
- **If removed**: No automatic inventory deduction when fulfilling requests
- **Impact**: Manual inventory management required

---

#### Controller Layer

**File**: `BloodInventoryController.java`

```java
@RestController
@RequestMapping(path = "/api/bloodinventories")
public class BloodInventoryController {
    @Autowired
    private BloodInventoryService inventoryService;

    @GetMapping
    public List<BloodInventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/{id}")
    public BloodInventory getInventoryById(@PathVariable int id) {
        return inventoryService.getInventoryById(id);
    }

    @PostMapping
    public BloodInventory createInventory(@RequestBody BloodInventory inventory) {
        return inventoryService.createInventory(inventory);
    }

    @PutMapping("/{id}")
    public BloodInventory updateInventory(@PathVariable int id, @RequestBody BloodInventory inventory) {
        return inventoryService.updateInventory(id, inventory);
    }

    @DeleteMapping("/{id}")
    public void deleteInventory(@PathVariable int id) {
        inventoryService.deleteInventoryById(id);
    }

    @GetMapping("/bloodgroup/{bloodGroup}")
    public List<BloodInventory> getInventoryByBloodGroup(@PathVariable String bloodGroup) {
        return inventoryService.getInventoryByBloodGroup(bloodGroup);
    }
}
```

**REST Compliance**:
- `/api/bloodinventories` - Plural noun for resource
- `/api/bloodinventories/bloodgroup/{bloodGroup}` - Filtering via path (could be query param)

---

### Emergency Request Service (Port 8084)

**Purpose**: Handles emergency blood requests from hospitals.

#### Configuration

**File**: `application.properties`

```properties
spring.application.name=Emergency-Request-Service
server.port=8084
server.servlet.context-path=/requests
spring.datasource.url=jdbc:mysql://localhost:3306/request_db
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Context Path**: `/requests` prefix for all endpoints
- **Impact**: All endpoints are `/requests/...` instead of `/api/...`
- **If removed**: Would need to update API gateway routing

---

#### Data Model

**File**: `Request.java`

```java
@Entity
@Table(name = "emergency_request")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "hospital_name")
    private String hospitalName;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "units_needed")
    private Integer unitsNeeded;

    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Column(name = "required_before")
    private LocalDate requiredBefore;

    @Column(name = "status")
    private String status; // PENDING, FULFILLED, CANCELLED
    // Getters and Setters...
}
```

**Priority Levels**:
- `LOW`: Non-urgent
- `MEDIUM`: Standard urgency
- `HIGH`: Urgent
- `CRITICAL`: Life-threatening

**Status Values**:
- `PENDING`: Request submitted, not yet fulfilled
- `FULFILLED`: Blood provided
- `CANCELLED`: Request cancelled by hospital

---

#### Repository Layer

**File**: `RequestRepository.java`

```java
@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    @Query("SELECT r FROM Request r WHERE r.bloodGroup=?1")
    List<Request> getRequestByBloodGroup(String bloodGroup);

    @Query("SELECT r FROM Request r WHERE r.status=?1")
    List<Request> getRequestByStatus(String status);

    @Query("SELECT r FROM Request r WHERE r.priority='Emergency'")
    List<Request> getEmergencyRequests();

    @Query("SELECT r FROM Request r WHERE r.priority=?1")
    List<Request> getRequestByPriority(String priority);

    @Query("SELECT r FROM Request r WHERE r.hospitalName=?1")
    List<Request> getRequestByHospitalName(String hospitalName);

    @Query("SELECT r FROM Request r WHERE r.requiredBefore=?1")
    List<Request> getRequestByRequiredBefore(LocalDate requiredBefore);

    @Query("SELECT r FROM Request r WHERE r.contactNumber=?1")
    List<Request> getRequestByContactNumber(String contactNumber);

    @Query("SELECT r FROM Request r WHERE r.bloodGroup=?1 AND r.status=?2")
    List<Request> getBloodGroupAndStatus(String bloodGroup, String status);

    @Query("SELECT r FROM Request r WHERE r.bloodGroup=?1 AND r.priority=?2")
    List<Request> getBloodGroupAndPriority(String bloodGroup, String priority);

    @Query("SELECT r FROM Request r WHERE r.hospitalName=?1 AND r.status=?2")
    List<Request> getHospitalAndStatus(String hospitalName, String status);

    @Query("SELECT r FROM Request r WHERE r.status='Pending'")
    List<Request> getPendingRequests();

    @Query("SELECT r FROM Request r WHERE r.status='Approved'")
    List<Request> getApprovedRequests();

    @Query("SELECT r FROM Request r WHERE r.status='Completed'")
    List<Request> getCompletedRequests();
}
```

**Query Methods**:
- Extensive filtering options for different use cases
- **If removed**: Frontend would need to filter client-side (inefficient)

---

#### Service Layer

**File**: `RequestService.java`

```java
@Service
public class RequestService {
    @Autowired
    private RequestRepository repository;

    public List<Request> getAllRequests() {
        return repository.findAll();
    }

    public Request getRequestById(int id) {
        return repository.findById(id).orElse(null);
    }

    public Request createRequest(Request request) {
        return repository.save(request);
    }

    public Request updateRequest(Request request) {
        return repository.save(request);
    }

    public void deleteRequest(int id) {
        repository.deleteById(id);
    }

    public Request cancelRequest(int id) {
        Request request = repository.findById(id).orElse(null);
        if (request != null) {
            request.setStatus("Cancelled");
            return repository.save(request);
        }
        return null;
    }

    // Other filtering methods...
}
```

**Business Logic**:
- `cancelRequest`: Soft delete (changes status instead of deleting)
- **If removed**: Would use hard delete (lose request history)

---

#### Controller Layer

**File**: `RequestController.java`

```java
@RestController
@RequestMapping(path = "/api")
public class RequestController {
    @Autowired
    private RequestService requestService;

    @GetMapping("/requests")
    public List<Request> getAllRequests() {
        return requestService.getAllRequests();
    }

    @GetMapping("/requests/{id}")
    public Request getRequestById(@PathVariable int id) {
        return requestService.getRequestById(id);
    }

    @PostMapping("/requests")
    public Request createRequest(@RequestBody Request request) {
        return requestService.createRequest(request);
    }

    @PutMapping("/requests/{id}")
    public Request updateRequest(@PathVariable int id, @RequestBody Request request) {
        return requestService.updateRequest(request);
    }

    @DeleteMapping("/requests/{id}")
    public void deleteRequest(@PathVariable int id) {
        requestService.deleteRequest(id);
    }

    // Additional filtering endpoints...
}
```

**Context Path Impact**:
- Full URL: `http://localhost:8084/requests/api/requests`
- **If context path removed**: `http://localhost:8084/api/requests`

---

### Notification Service (Port 8085)

**Purpose**: Sends email notifications for various events.

#### Data Models

**File**: `NotificationRequest.java`

```java
public class NotificationRequest {
    private String recipientEmail;
    private String subject;
    private String message;
    // Getters and Setters...
}
```

**Purpose**: DTO for notification requests.

---

**File**: `NotificationLog.java`

```java
@Entity
@Table(name = "notification_logs")
public class NotificationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientEmail;
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status; // SENT, FAILED
    private LocalDateTime sentAt;
    // Getters and Setters...
}
```

**Purpose**: Audit log for all notifications sent.

**`@Column(columnDefinition = "TEXT")`**: Stores long messages
- **If removed**: Default VARCHAR(255) might truncate long messages

---

#### Service Layer

**File**: `EmailService.java`

```java
@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final NotificationLogRepository logRepository;

    public EmailService(JavaMailSender mailSender, NotificationLogRepository logRepository) {
        this.mailSender = mailSender;
        this.logRepository = logRepository;
    }

    public void sendEmailAlert(NotificationRequest request) {
        NotificationLog log = new NotificationLog();
        log.setRecipientEmail(request.getRecipientEmail());
        log.setSubject(request.getSubject());
        log.setMessage(request.getMessage());
        log.setSentAt(LocalDateTime.now());

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(request.getRecipientEmail());
            mailMessage.setSubject(request.getSubject());
            mailMessage.setText(request.getSubject());

            mailSender.send(mailMessage);

            log.setStatus("SENT");
        } catch (Exception e) {
            log.setStatus("FAILED: " + e.getMessage());
            System.err.println("Failed to send email: " + e.getMessage());
        } finally {
            logRepository.save(log);
        }
    }
}
```

**Constructor Injection**: Preferred over `@Autowired` for better testability
- **If changed to field injection**: Harder to mock in tests

**Error Handling**:
- Catches exceptions and logs failure
- **If removed**: Unhandled exceptions would propagate to caller

**Audit Trail**:
- Always saves log regardless of success/failure
- **If removed**: No record of sent notifications

---

#### Controller Layer

**File**: `NotificationController.java`

```java
@RestController
@RequestMapping(path = "/api/notifications")
public class NotificationController {
    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendNotification(@RequestBody NotificationRequest request) {
        emailService.sendEmailAlert(request);
        return "Notification sent successfully";
    }
}
```

**Action-Based Endpoint**: `/send` is a verb (non-CRUD operation)
- **If changed to noun**: Would be less semantic (e.g., `/notifications/create`)

---

## API Gateway (Port 8080)

**Purpose**: Single entry point for all client requests, routes to appropriate microservices.

#### Application Entry Point

**File**: `ApiGatewayApplication.java`

```java
@SpringBootApplication
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```

---

#### Configuration

**File**: `application.yml`

```yaml
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Origin Access-Control-Allow-Credentials, RETAIN_UNIQUE
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:3000"
              - "http://localhost:5173"
              - "http://127.0.0.1:3000"
              - "http://127.0.0.1:5173"
            allowedMethods: GET,POST,PUT,DELETE,OPTIONS,PATCH
            allowedHeaders: "*"
            allowCredentials: true
            maxAge: 3600
      routes:
        # User Service Routes
        - id: user-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/users/**
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/auth/**
        - id: stats-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/stats/**

        # Campaign Service Routes
        - id: campaign-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/campaigns/**
        - id: appointment-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/appointments/**

        # Blood Inventory Service Routes
        - id: inventory-service
          uri: http://localhost:8083
          predicates:
            - Path=/api/bloodinventories/**

        # Emergency Request Service Routes
        - id: emergency-request-service
          uri: http://localhost:8084
          predicates:
            - Path=/requests/**

        # Notification Service Routes
        - id: notification-service
          uri: http://localhost:8085
          predicates:
            - Path=/api/notifications/**

server:
  port: 8080

logging:
  level:
    org.springframework.cloud.gateway: DEBUG
    org.springframework.web: INFO
```

**Configuration Explained**:

**CORS (Cross-Origin Resource Sharing)**:
- `allowedOrigins`: Frontend URLs allowed to access API
- `allowedMethods`: HTTP methods permitted
- `allowCredentials`: Allows cookies/auth headers
- **If removed**: Browser blocks requests from frontend (CORS error)

**Routes**:
- `id`: Unique identifier for route
- `uri`: Target service URL
- `predicates`: Conditions to match route
- **If route missing**: Requests to that path fail with 404

**Path Matching**:
- `/api/users/**` → Matches `/api/users`, `/api/users/1`, `/api/users/search`
- **If wrong pattern**: Requests won't be routed correctly

**Load Balancing** (not implemented):
- Could use `lb://service-name` with service discovery
- **Current**: Hardcoded URLs (not production-ready)

**What happens if gateway is removed**:
- Frontend must know each service's port
- CORS must be configured on each service
- No centralized logging/authentication

---

## Frontend Application (Port 3000)

**Purpose**: User interface for donors, hospitals, and admins.

### Technology Stack
- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Fetch API
- **Styling**: CSS with CSS variables

### Project Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── api.js              # API calls
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── RequireRole.jsx     # Route protection
│   ├── hooks/
│   │   └── useRole.js          # Role management hook
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page
│   │   ├── LoginPage.jsx       # Login
│   │   ├── RegisterPage.jsx    # Registration
│   │   ├── CampaignsPage.jsx   # Campaign list
│   │   ├── CampaignDetailPage.jsx  # Campaign details
│   │   ├── ProfilePage.jsx     # User profile
│   │   ├── MyAppointmentsPage.jsx   # User appointments
│   │   ├── DonorsPage.jsx      # Donor management (admin)
│   │   ├── HospitalsPage.jsx   # Hospital management (admin)
│   │   ├── InventoryPage.jsx   # Blood inventory (admin)
│   │   ├── EmergencyRequestsPage.jsx  # Emergency requests
│   │   └── FindDonorsPage.jsx  # Donor search
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

---

### Entry Point

**File**: `main.jsx`

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**What it does**:
- Mounts React app to DOM element with id `root`
- `React.StrictMode`: Enables additional checks and warnings (development only)
- **If removed**: App still works but loses development warnings

---

### Main Application

**File**: `App.jsx`

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequireRole from './components/RequireRole';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import ProfilePage from './pages/ProfilePage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import DonorsPage from './pages/DonorsPage';
import HospitalsPage from './pages/HospitalsPage';
import InventoryPage from './pages/InventoryPage';
import EmergencyRequestsPage from './pages/EmergencyRequestsPage';
import FindDonorsPage from './pages/FindDonorsPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        <Route 
          path="/profile/:id" 
          element={
            <RequireRole allow={['ADMIN', 'DONOR', 'HOSPITAL']}>
              <ProfilePage />
            </RequireRole>
          } 
        />
        <Route 
          path="/my-appointments" 
          element={
            <RequireRole allow={['ADMIN', 'DONOR']}>
              <MyAppointmentsPage />
            </RequireRole>
          } 
        />
        <Route 
          path="/donors" 
          element={
            <RequireRole allow={['ADMIN']}>
              <DonorsPage />
            </RequireRole>
          } 
        />
        <Route 
          path="/hospitals" 
          element={
            <RequireRole allow={['ADMIN']}>
              <HospitalsPage />
            </RequireRole>
          } 
        />
        <Route 
          path="/inventory" 
          element={
            <RequireRole allow={['ADMIN']}>
              <InventoryPage />
            </RequireRole>
          } 
        />
        <Route 
          path="/emergency-requests" 
          element={
            <RequireRole allow={['ADMIN', 'HOSPITAL']}>
              <EmergencyRequestsPage />
            </RequireRole>
          } 
        />
        <Route 
          path="/find-donors" 
          element={
            <RequireRole allow={['ADMIN', 'HOSPITAL']}>
              <FindDonorsPage />
            </RequireRole>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**React Router Explained**:
- `BrowserRouter`: Uses HTML5 history API for clean URLs
- `Routes`: Container for route definitions
- `Route`: Maps path to component
- `path="*"`: Catch-all for undefined routes (404)
- `Navigate`: Redirects to specified path

**Route Protection**:
- `RequireRole`: Wrapper component that checks user role
- **If removed**: Anyone could access admin pages (security issue)

**What happens if routing is wrong**:
- Users can't navigate to pages
- 404 errors on valid paths
- Broken navigation links

---

### Custom Hooks

**File**: `useRole.js`

```javascript
export function useRole() {
  const role   = sessionStorage.getItem('role')   || '';
  const userId = sessionStorage.getItem('userId') || null;

  return {
    role,
    userId,
    isAdmin: role === 'ROLE_ADMIN',
    isDonor: role === 'ROLE_USER' || role === 'ROLE_DONOR',
    isHospital: role === 'ROLE_HOSPITAL',
    isLoggedIn: !!userId,
  };
}
```

**Purpose**: Centralizes role logic for reuse across components.

**sessionStorage**: Browser storage that persists until tab closed
- **If changed to localStorage**: Persists across browser sessions (security risk)
- **If removed**: Must pass role/ID as props (prop drilling)

**What happens if hook is removed**:
- Each component must implement role logic separately
- Code duplication and maintenance burden

---

### Route Protection

**File**: `RequireRole.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

export default function RequireRole({ allow, children, fallback = '/campaigns' }) {
  const { isLoggedIn, isAdmin, isDonor, isHospital } = useRole();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const roles = {
    ADMIN: isAdmin,
    DONOR: isDonor,
    HOSPITAL: isHospital,
  };

  const ok = allow.some(r => roles[r]);
  if (!ok) return <Navigate to={fallback} replace />;

  return children;
}
```

**Logic**:
1. Check if user is logged in
2. Check if user's role is in allowed list
3. Redirect if conditions not met

**What happens if removed**:
- Unauthorized users can access protected pages
- Security vulnerability

---

### Navigation Bar

**File**: `Navbar.jsx`

```javascript
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isHospital, isDonor, isLoggedIn, userId } = useRole();

  function handleLogout() {
    sessionStorage.clear();
    navigate('/login');
  }

  const roleLinks = [];
  if (isLoggedIn) {
    if (isDonor) {
      roleLinks.push({ to: '/my-appointments', label: 'My Bookings' });
    }
    if (isHospital || isAdmin) {
      roleLinks.push({ to: '/emergency-requests', label: 'Emergency' });
    }
    if (isAdmin) {
      roleLinks.push(
        { to: '/donors', label: 'Donors' },
        { to: '/hospitals', label: 'Hospitals' },
        { to: '/inventory', label: 'Inventory' },
        { to: '/my-appointments', label: 'Bookings' },
      );
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">BloodLink</Link>
      <div className="navbar-links">
        <Link to="/campaigns">Campaigns</Link>
        {roleLinks.map(l => (
          <Link key={l.to} to={l.to}>{l.label}</Link>
        ))}
      </div>
      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <span>{role}</span>
            <Link to={`/profile/${userId}`}>Profile</Link>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

**Dynamic Navigation**:
- Shows different links based on user role
- **If removed**: All users see all links (confusing UX)

**useLocation**: Gets current path for active link styling
- **If removed**: Can't highlight current page

**useNavigate**: Programmatic navigation
- **If removed**: Can't redirect after logout

---

### API Layer

**File**: `api.js`

```javascript
const API_BASE = '/api';

async function get(url) {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error(await res.text() || 'Request failed');
  return res.json();
}

async function post(url, body) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text() || 'Request failed');
  return res.json();
}

async function put(url, body) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text() || 'Request failed');
  return res.json();
}

async function del(url) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(await res.text() || 'Request failed');
  return res.json();
}

// Auth APIs
export const loginUser = (data) => post('/auth/login', data);
export const registerUser = (data) => post('/auth/register', data);
export const checkEmail = (email) => get(`/auth/checkemail?email=${encodeURIComponent(email)}`);

// User APIs
export const getAllDonors = () => get('/users?role=ROLE_USER');
export const getAllHospitals = () => get('/users?role=ROLE_HOSPITAL');
export const getUserById = (id) => get(`/users/${id}`);
export const updateUser = (id, data) => put(`/users/${id}`, data);
export const deleteUser = (id) => del(`/users/${id}`);
export const createUser = (data) => post('/users', data);
export const getUsersByBloodGroup = (bloodGroup) => get(`/users?bloodGroup=${encodeURIComponent(bloodGroup)}`);
export const searchEligibleDonors = (bloodGroup, city) => get(`/users?eligibleDonors=true&bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`);

// Campaign APIs
export const getAllCampaigns = () => get('/campaigns');
export const getCampaignById = (id) => get(`/campaigns/${id}`);
export const createCampaign = (data) => post('/campaigns', data);
export const updateCampaign = (id, data) => put(`/campaigns/${id}`, data);
export const deleteCampaign = (id) => del(`/campaigns/${id}`);
export const getUpcomingCampaigns = () => get('/campaigns?upcoming=true');
export const getCampaignsByLocation = (location) => get(`/campaigns?location=${encodeURIComponent(location)}`);

// Appointment APIs
export const getAllAppointments = () => get('/appointments');
export const getAppointmentById = (id) => get(`/appointments/${id}`);
export const createAppointment = (data) => post('/appointments', data);
export const updateAppointment = (id, data) => put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => del(`/appointments/${id}`);
export const getAppointmentsByCampaign = (campaignId) => get(`/appointments/campaign/${campaignId}`);
export const getAppointmentsByDonor = (donorId) => get(`/appointments/donor/${donorId}`);
export const getAppointmentCountByCampaign = (campaignId) => get(`/appointments/count/campaign/${campaignId}`);
export const checkDonorAppointmentExists = (campaignId, donorId) => get(`/appointments/check/${campaignId}/${donorId}`);

// Inventory APIs
export const getAllInventory = () => get('/bloodinventories');
export const getInventoryById = (id) => get(`/bloodinventories/${id}`);
export const createInventory = (data) => post('/bloodinventories', data);
export const updateInventory = (id, data) => put(`/bloodinventories/${id}`, data);
export const deleteInventory = (id) => del(`/bloodinventories/${id}`);
export const getInventoryByBloodGroup = (bloodGroup) => get(`/bloodinventories/bloodgroup/${bloodGroup}`);

// Emergency Request APIs
export const getAllRequests = () => get('/requests/api/requests');
export const getRequestById = (id) => get(`/requests/api/requests/${id}`);
export const createRequest = (data) => post('/requests/api/requests', data);
export const updateRequest = (id, data) => put(`/requests/api/requests/${id}`, data);
export const deleteRequest = (id) => del(`/requests/api/requests/${id}`);
export const getRequestsByBloodGroup = (bloodGroup) => get(`/requests/api/requests/bloodgroup/${bloodGroup}`);
export const getRequestsByStatus = (status) => get(`/requests/api/requests/status/${status}`);
export const getRequestsByPriority = (priority) => get(`/requests/api/requests/priority/${priority}`);
export const getRequestsByHospitalName = (hospitalName) => get(`/requests/api/requests/hospital/${hospitalName}`);
export const getUserById = (id) => get(`/users/${id}`);
```

**HTTP Client**:
- Wraps `fetch` API with error handling
- **If removed**: Each component must implement fetch logic (duplication)

**API_BASE**: `/api` routes through Vite proxy to gateway
- **If changed to full URL**: Would bypass proxy (CORS issues)

**Error Handling**:
- Throws error on non-OK responses
- **If removed**: Components would need to check `res.ok` manually

**What happens if API base is wrong**:
- All API calls fail
- Network errors in console

---

### Page Components

#### Login Page

**File**: `LoginPage.jsx`

```javascript
export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (res.userId) sessionStorage.setItem('userId', res.userId);
      if (res.role)   sessionStorage.setItem('role',   res.role);
      const role = res.role || '';
      if (role === 'ROLE_ADMIN') navigate('/inventory');
      else if (role === 'ROLE_HOSPITAL') navigate('/emergency-requests');
      else navigate('/campaigns');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

**State Management**:
- `useState`: React hook for component state
- **If removed**: Can't track form input or loading state

**Navigation Logic**:
- Redirects based on user role
- **If removed**: All users go to same page after login

**Session Storage**:
- Stores userId and role for subsequent requests
- **If removed**: Can't maintain authentication state

---

#### Register Page

**File**: `RegisterPage.jsx`

```javascript
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1 = choose type, 2 = details
  const [form, setForm] = useState({
    firstName: '', lastName: '', hospitalName: '', email: '', password: '',
    bloodGroup: '', phoneNumber: '', city: '',
    availableToDonate: true, role: '',
  });

  function chooseType(role) {
    setForm(prev => ({
      ...EMPTY_FORM,
      role,
      availableToDonate: role === 'ROLE_USER',
    }));
    setStep(2);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const payload = {
      email: form.email,
      password: form.password,
      role: form.role,
      phoneNumber: form.phoneNumber,
      city: form.city,
    };

    if (isHospital) {
      payload.hospitalName = form.hospitalName;
      payload.firstName = form.firstName || form.hospitalName;
      payload.lastName = form.lastName || 'Hospital';
      payload.bloodGroup = null;
      payload.availableToDonate = false;
    } else {
      payload.firstName = form.firstName;
      payload.lastName = form.lastName;
      payload.bloodGroup = form.bloodGroup;
      payload.availableToDonate = !!form.availableToDonate;
      payload.hospitalName = null;
    }

    await registerUser(payload);
    navigate('/login');
  }

  return (
    {/* Multi-step form */}
  );
}
```

**Multi-Step Form**:
- Step 1: Choose account type (Donor/Hospital)
- Step 2: Enter details
- **If simplified to single step**: Longer form, worse UX

**Conditional Payload**:
- Different fields based on role
- **If removed**: Would send irrelevant fields (e.g., bloodGroup for hospital)

---

#### Campaigns Page

**File**: `CampaignsPage.jsx`

```javascript
export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [appointmentCounts, setAppointmentCounts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const { isAdmin, isDonor } = useRole();

  async function load(mode, loc) {
    let data;
    if (mode === 'upcoming') data = await getUpcomingCampaigns();
    else if (loc) data = await getCampaignsByLocation(loc);
    else data = await getAllCampaigns();
    setCampaigns(data);

    // Fetch appointment counts for each campaign
    const counts = {};
    for (const campaign of data) {
      const countData = await getAppointmentCountByCampaign(campaign.id);
      counts[campaign.id] = countData.count;
    }
    setAppointmentCounts(counts);
  }

  async function onSave(e) {
    e.preventDefault();
    const payload = { ...form, maxDonors: Number(form.maxDonors) };
    if (editId) await updateCampaign(editId, payload);
    else await createCampaign(payload);
    cancelForm();
    load('all', '');
  }

  return (
    {/* Campaign list with admin controls */}
  );
}
```

**Data Fetching**:
- Loads campaigns and appointment counts
- **If counts not fetched**: Can't show remaining spots

**Admin Controls**:
- Only admins see add/edit/delete buttons
- **If removed**: Donors could modify campaigns (security issue)

---

#### Campaign Detail Page

**File**: `CampaignDetailPage.jsx`

```javascript
export default function CampaignDetailPage() {
  const { id } = useParams();
  const { isDonor, isLoggedIn, userId } = useRole();
  const canBook = isDonor && isLoggedIn;

  const [hasAppointment, setHasAppointment] = useState(false);
  const [userAppointment, setUserAppointment] = useState(null);

  async function onBook(e) {
    e.preventDefault();
    await createAppointment({
      campaignId: Number(id),
      donorId: Number(userId),
      status: 'PENDING'
    });
    await loadData();
  }

  async function onCancel() {
    await deleteAppointment(userAppointment.id);
    await loadData();
  }

  const remainingSpots = campaign ? (campaign.maxDonors - appointmentCount) : 0;
  const isFull = remainingSpots <= 0;

  return (
    {/* Campaign details with booking controls */}
  );
}
```

**Booking Logic**:
- Checks if user already has appointment
- Checks if campaign is full
- **If validation removed**: Could book multiple times or exceed capacity

**useParams**: Gets URL parameters (campaign ID)
- **If removed**: Can't know which campaign to display

---

#### Profile Page

**File**: `ProfilePage.jsx`

```javascript
export default function ProfilePage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  const isHospital = form?.role === 'ROLE_HOSPITAL';
  const isDonor = form?.role === 'ROLE_USER' || form?.role === 'ROLE_DONOR';

  async function onSubmit(e) {
    e.preventDefault();
    const payload = isHospital
      ? { hospitalName: form.hospitalName, firstName: form.firstName, ... }
      : { firstName: form.firstName, bloodGroup: form.bloodGroup, ... };
    await updateUser(id, payload);
    setSuccess('Profile updated successfully.');
  }

  return (
    {/* Profile form with role-specific fields */}
  );
}
```

**Conditional Rendering**:
- Shows different fields based on role
- **If removed**: All users see all fields (confusing)

**Read-Only Email**:
- Email cannot be changed (security)
- **If editable**: Users could change email to hijack accounts

---

#### Admin Pages

**DonorsPage, HospitalsPage, InventoryPage, EmergencyRequestsPage** follow similar patterns:
- Fetch data from API
- Display in table
- Admin can add/edit/delete
- Filter/search functionality

**Common Pattern**:
```javascript
const [data, setData] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editId, setEditId] = useState(null);

async function load() {
  setData(await fetchData());
}

async function onSave(e) {
  e.preventDefault();
  if (editId) await updateData(editId, form);
  else await createData(form);
  cancelForm();
  load();
}

async function onDelete(id) {
  await deleteData(id);
  load();
}
```

**What happens if CRUD operations removed**:
- Admin can't manage data
- System becomes read-only

---

### Vite Configuration

**File**: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/requests': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

**Proxy Configuration**:
- Routes `/api` and `/requests` to API gateway
- **If removed**: Frontend must call full URLs (CORS issues)
- **changeOrigin**: Changes origin header to match target

**What happens if proxy is misconfigured**:
- API calls fail with 404 or CORS errors
- Frontend cannot communicate with backend

---

## Database Architecture

### Database Schema

**bloodbank_users** (User Service):
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    blood_group VARCHAR(10),
    city VARCHAR(255),
    phone_number VARCHAR(50),
    hospital_name VARCHAR(255),
    available_to_donate BOOLEAN,
    last_donation_date DATE
);
```

**campaign_db** (Campaign Service):
```sql
CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    location VARCHAR(255),
    date DATE,
    start_time TIME,
    end_time TIME,
    organizer VARCHAR(255),
    max_donors INT,
    description TEXT
);

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    donor_id INT,
    appointment_date DATE,
    time_slot VARCHAR(50),
    status VARCHAR(50)
);
```

**bloodinventorydb** (Inventory Service):
```sql
CREATE TABLE blood_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blood_group VARCHAR(10),
    units_available INT,
    blood_bank_name VARCHAR(255),
    location VARCHAR(255),
    expiry_date VARCHAR(255)
);
```

**request_db** (Emergency Request Service):
```sql
CREATE TABLE emergency_request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(255),
    contact_number VARCHAR(50),
    blood_group VARCHAR(10),
    units_needed INT,
    priority VARCHAR(50),
    request_date DATE,
    required_before DATE,
    status VARCHAR(50)
);
```

### Database Relationships

**Loose Coupling**:
- No foreign key constraints across services
- Relationships maintained via IDs
- **If enforced with FKs**: Would require distributed transactions (complex)

**Data Consistency**:
- Each service manages its own database
- **If single database**: Would violate microservices principles

---

## REST API Endpoints

### User Service (Port 8081)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/register` | Register new user | User object | AuthResponse |
| POST | `/api/auth/login` | Authenticate user | AuthRequest | AuthResponse |
| DELETE | `/api/auth/logout` | Logout user | - | AuthResponse |
| GET | `/api/auth/checkemail` | Check email exists | email (query) | {isRegistered} |
| GET | `/api/users` | Get all users | city, bloodGroup, availableToDonate, role, eligibleDonors (query) | User[] |
| GET | `/api/users/{id}` | Get user by ID | - | User |
| PUT | `/api/users/{id}` | Update user | User object | AuthResponse |
| DELETE | `/api/users/{id}` | Delete user | - | AuthResponse |
| GET | `/api/users/me` | Get current user | email (query) | User |
| PUT | `/api/users/me/password` | Change password | email, oldPassword, newPassword (query) | AuthResponse |
| GET | `/api/stats/users/bloodgroups` | Get blood group counts | - | BloodGroupCount[] |

### Campaign Service (Port 8082)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/campaigns` | Get all campaigns | location, upcoming (query) | Campaign[] |
| GET | `/api/campaigns/{id}` | Get campaign by ID | - | Campaign |
| POST | `/api/campaigns` | Create campaign | Campaign object | Campaign |
| PUT | `/api/campaigns/{id}` | Update campaign | Campaign object | Campaign |
| DELETE | `/api/campaigns/{id}` | Delete campaign | - | - |
| GET | `/api/appointments` | Get all appointments | - | Appointment[] |
| GET | `/api/appointments/{id}` | Get appointment by ID | - | Appointment |
| POST | `/api/appointments` | Create appointment | Appointment object | Appointment |
| PUT | `/api/appointments/{id}` | Update appointment | Appointment object | Appointment |
| DELETE | `/api/appointments/{id}` | Delete appointment | - | - |
| GET | `/api/appointments/campaign/{campaignId}` | Get appointments by campaign | - | Appointment[] |
| GET | `/api/appointments/donor/{donorId}` | Get appointments by donor | - | Appointment[] |
| GET | `/api/appointments/count/campaign/{campaignId}` | Count appointments by campaign | - | {count} |
| GET | `/api/appointments/check/{campaignId}/{donorId}` | Check donor appointment | - | {exists} |

### Inventory Service (Port 8083)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/bloodinventories` | Get all inventory | - | BloodInventory[] |
| GET | `/api/bloodinventories/{id}` | Get inventory by ID | - | BloodInventory |
| POST | `/api/bloodinventories` | Create inventory | BloodInventory object | BloodInventory |
| PUT | `/api/bloodinventories/{id}` | Update inventory | BloodInventory object | BloodInventory |
| DELETE | `/api/bloodinventories/{id}` | Delete inventory | - | - |
| GET | `/api/bloodinventories/bloodgroup/{bloodGroup}` | Get by blood group | - | BloodInventory[] |

### Emergency Request Service (Port 8084)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/requests/api/requests` | Get all requests | - | Request[] |
| GET | `/requests/api/requests/{id}` | Get request by ID | - | Request |
| POST | `/requests/api/requests` | Create request | Request object | Request |
| PUT | `/requests/api/requests/{id}` | Update request | Request object | Request |
| DELETE | `/requests/api/requests/{id}` | Delete request | - | - |
| GET | `/requests/api/requests/bloodgroup/{bloodGroup}` | Get by blood group | - | Request[] |
| GET | `/requests/api/requests/status/{status}` | Get by status | - | Request[] |
| GET | `/requests/api/requests/priority/{priority}` | Get by priority | - | Request[] |
| GET | `/requests/api/requests/hospital/{hospitalName}` | Get by hospital | - | Request[] |

### Notification Service (Port 8085)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/notifications/send` | Send notification | NotificationRequest | String |

---

## Annotations Explained

### Spring Annotations

| Annotation | Purpose | Impact if Removed |
|------------|---------|-------------------|
| `@SpringBootApplication` | Main application entry point | Application won't start |
| `@RestController` | REST controller (JSON responses) | Returns view names instead of JSON |
| `@Controller` | MVC controller (view returns) | N/A for REST APIs |
| `@RequestMapping` | Base path for controller endpoints | Each endpoint needs full path |
| `@GetMapping` | Map HTTP GET to method | Endpoint not accessible via GET |
| `@PostMapping` | Map HTTP POST to method | Endpoint not accessible via POST |
| `@PutMapping` | Map HTTP PUT to method | Endpoint not accessible via PUT |
| `@DeleteMapping` | Map HTTP DELETE to method | Endpoint not accessible via DELETE |
| `@PatchMapping` | Map HTTP PATCH to method | Endpoint not accessible via PATCH |
| `@RequestBody` | Bind request body to parameter | Parameter is null |
| `@ResponseBody` | Return response body instead of view | Returns view name |
| `@PathVariable` | Bind URI variable to parameter | Parameter is null |
| `@RequestParam` | Bind query parameter to parameter | Parameter is null |
| `@Autowired` | Dependency injection | Must manually create dependencies |
| `@Service` | Mark as service layer component | Not scanned by Spring |
| `@Repository` | Mark as repository layer component | Not scanned by Spring |
| `@Component` | Generic Spring component | Not scanned by Spring |
| `@Entity` | JPA entity (maps to table) | Not recognized as persistent class |
| `@Table` | Specify table name | Uses default table name |
| `@Id` | Mark as primary key | No primary key identified |
| `@GeneratedValue` | Auto-generate primary key | Must manually set ID |
| `@Column` | Map field to column | Uses default column name |
| `@Query` | Custom JPQL query | Uses method name derivation |
| `@Transactional` | Transaction management | No transaction boundaries |

### JPA Annotations

| Annotation | Purpose | Impact if Removed |
|------------|---------|-------------------|
| `@Entity` | Mark class as JPA entity | Not managed by JPA |
| `@Table` | Specify table name | Uses class name as table name |
| `@Id` | Mark field as primary key | No primary key |
| `@GeneratedValue` | Auto-generate ID | Must set ID manually |
| `@Column` | Specify column mapping | Uses default mapping |
| `@OneToMany` | One-to-many relationship | No relationship mapping |
| `@ManyToOne` | Many-to-one relationship | No relationship mapping |
| `@JoinColumn` | Foreign key column | No foreign key |
| `@Embedded` | Embed another entity | Fields flattened to table |

---

## Component Interactions

### Request Flow

1. **User Action**: User clicks "Login" button in frontend
2. **Frontend**: `LoginPage.jsx` calls `loginUser(form)` from `api.js`
3. **API Layer**: `api.js` makes POST request to `/api/auth/login`
4. **Vite Proxy**: Routes request to `http://localhost:8080`
5. **API Gateway**: Matches route to user-service (`/api/auth/**`)
6. **User Service**: `AuthController.login()` receives request
7. **Service Layer**: `UserService.authenticateUser()` validates credentials
8. **Repository Layer**: `UserRepository.findByEmail()` queries database
9. **Database**: Returns user record
10. **Response**: AuthResponse with userId and role
11. **Frontend**: Stores in sessionStorage, redirects based on role

### Data Flow Diagram

```
User → Frontend → API Layer → Vite Proxy → API Gateway → Microservice → Repository → Database
```

### Service Communication

**Current Design**: No direct service-to-service communication
- Each service is independent
- Frontend orchestrates calls to multiple services
- **If services need to communicate**: Would use HTTP calls or message broker

**Example**: Booking appointment
1. Frontend calls `/api/appointments` (Campaign Service)
2. Campaign Service saves appointment
3. Frontend calls `/api/users/{id}` (User Service) to get donor info
4. Frontend displays confirmation

**If services communicated directly**:
- Campaign Service would call User Service
- Tighter coupling between services
- More complex error handling

---

## Impact of Code Changes

### Removing Code Blocks

| Code Block | Impact of Removal | Severity |
|------------|-------------------|----------|
| `@SpringBootApplication` | Application won't start | Critical |
| `@RestController` | Returns HTML instead of JSON | High |
| `@Autowired` | Dependency injection fails | High |
| `@Entity` | JPA doesn't recognize entity | Critical |
| `@Id` | No primary key | Critical |
| Repository interface | No data access | Critical |
| Service layer | Business logic in controllers | Medium |
| Controller | No HTTP endpoints | Critical |
| API Gateway routing | 404 errors | High |
| Frontend API calls | No backend communication | Critical |
| `useRole` hook | No role management | High |
| `RequireRole` | No route protection | Critical |
| Session storage | No authentication state | Critical |

### Adding Extra Code

| Addition | Impact | Considerations |
|----------|--------|----------------|
| New endpoint | New functionality | Must update frontend |
| New field in entity | Schema migration | Need database migration strategy |
| New service | New microservice | Add to gateway routing |
| Validation annotations | Data integrity | Must handle validation errors |
| Logging | Debugging | Performance impact |
| Caching | Performance | Cache invalidation strategy |
| Authentication filter | Security | Must integrate with existing auth |

### Changing Configuration

| Change | Impact | Risk |
|--------|--------|------|
| Port number | Client must update URL | Medium |
| Database URL | Connection failure | High |
| JPA `ddl-auto` to `create` | Data loss on restart | Critical |
| CORS settings | Frontend blocked | High |
| Gateway routes | 404 errors | High |
| Proxy target | API calls fail | High |

---

## Security Considerations

### Current Security Issues

1. **Plaintext Passwords**: Passwords stored in plain text (should use bcrypt)
2. **No JWT**: No token-based authentication (session-based only)
3. **No Rate Limiting**: Vulnerable to brute force attacks
4. **No Input Validation**: SQL injection risk (mitigated by JPA)
5. **No HTTPS**: Data transmitted in plain text
6. **Session Storage**: XSS vulnerability (should use httpOnly cookies)

### Recommended Improvements

1. **Password Hashing**: Use BCryptPasswordEncoder
2. **JWT Tokens**: Stateless authentication
3. **Rate Limiting**: Spring Cloud Gateway filters
4. **Input Validation**: `@Valid` annotation
5. **HTTPS**: SSL/TLS certificates
6. **Secure Cookies**: httpOnly, secure flags

---

## Performance Considerations

### Current Performance

1. **N+1 Query Problem**: Appointment counts fetched individually
2. **No Pagination**: Large datasets could slow down
3. **No Caching**: Repeated database queries
4. **Synchronous Calls**: Frontend waits for each API call

### Recommended Improvements

1. **Batch Queries**: Fetch all counts in single query
2. **Pagination**: Spring Data `Pageable`
3. **Caching**: Spring Cache abstraction
4. **Async Calls**: React `Promise.all()`

---

## Deployment Considerations

### Current Setup

- All services run on localhost
- No containerization
- No service discovery
- No load balancing

### Production Deployment

1. **Docker**: Containerize each service
2. **Kubernetes**: Orchestrate containers
3. **Service Discovery**: Eureka or Consul
4. **Load Balancer**: Nginx or AWS ELB
5. **Database**: Managed database (RDS)
6. **Monitoring**: Prometheus + Grafana
7. **Logging**: ELK Stack or CloudWatch

---

## Conclusion

This Blood Donation System demonstrates a microservices architecture with:
- **5 independent services** handling different domains
- **API Gateway** for centralized routing
- **React frontend** with role-based access control
- **MySQL databases** for data persistence
- **RESTful APIs** following best practices

The system is functional for educational purposes but requires security, performance, and deployment improvements for production use.

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-18  
**Author**: System Documentation Generator
