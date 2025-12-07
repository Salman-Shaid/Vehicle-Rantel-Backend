
<body>

  <h1> Vehicle Rental Backend</h1>

  <p><strong>Live URL:</strong> <a href="https://vehicle-rental-backend-ten.vercel.app" target="_blank">https://vehicle-rental-backend-ten.vercel.app</a></p>

  <h2> Project Overview</h2>
  <p>
    Vehicle Rental Backend is a RESTful API built with Node.js, TypeScript, and PostgreSQL. It provides full functionality for managing vehicles, customers, and bookings with secure authentication and role-based authorization.
  </p>

  <h2> Features</h2>
  <ul>
    <li>User Signup & Signin (Admin & Customer roles)</li>
    <li>Role-based access control</li>
    <li>CRUD operations for Vehicles, Bookings, and Users</li>
    <li>Booking management with rent dates, total price calculation, and status updates</li>
    <li>Secure password hashing with bcrypt</li>
    <li>JWT-based authentication</li>
    <li>Error handling middleware</li>
  </ul>

  <h2>🛠 Technology Stack</h2>
  <ul>
    <li>Backend: Node.js, Express.js, TypeScript</li>
    <li>Database: PostgreSQL</li>
    <li>Authentication: JWT, bcrypt</li>
    <li>Deployment: Vercel</li>
    <li>Environment Management: dotenv</li>
  </ul>

  <h2> Setup & Usage</h2>

  <h3>1. Clone the repository</h3>
  <pre><code>git clone https://github.com/Salman-Shaid/Vehicle-Rantel-Backend
cd vehicle-rental-backend</code></pre>

  <h3>2. Install dependencies</h3>
  <pre><code>npm install</code></pre>

  <h3>3. Create a <code>.env</code> file</h3>
  <pre><code>PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
BCRYPT_SALT_ROUNDS=10</code></pre>

  <h3>4. Build TypeScript files</h3>
  <pre><code>tsc</code></pre>

  <h3>5. Start the server</h3>

<p><strong>For development:</strong></p>
<pre><code>npm run dev</code></pre>

<p><strong>For production (after building):</strong></p>
<pre><code>npm start</code></pre>


  <p>The server will run on <code>http://localhost:5000</code></p>

  <h2> API Endpoints</h2>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>POST</td>
        <td>/api/v1/auth/signup</td>
        <td>Create a new user</td>
      </tr>
      <tr>
        <td>POST</td>
        <td>/api/v1/auth/signin</td>
        <td>Login user and get JWT</td>
      </tr>
      <tr>
        <td>GET</td>
        <td>/api/v1/vehicles</td>
        <td>Get all vehicles</td>
      </tr>
      <tr>
        <td>POST</td>
        <td>/api/v1/vehicles</td>
        <td>Add a new vehicle (Admin)</td>
      </tr>
      <tr>
        <td>PUT</td>
        <td>/api/v1/vehicles/:id</td>
        <td>Update vehicle (Admin)</td>
      </tr>
      <tr>
        <td>DELETE</td>
        <td>/api/v1/vehicles/:id</td>
        <td>Delete vehicle (Admin)</td>
      </tr>
      <tr>
        <td>GET</td>
        <td>/api/v1/bookings</td>
        <td>Get bookings</td>
      </tr>
      <tr>
        <td>POST</td>
        <td>/api/v1/bookings</td>
        <td>Create booking</td>
      </tr>
      <tr>
        <td>PUT</td>
        <td>/api/v1/bookings/:bookingId</td>
        <td>Update booking</td>
      </tr>
    </tbody>
  </table>

  <h2> Notes</h2>
  <ul>
    <li>Use <code>Authorization: Bearer &lt;token&gt;</code> header for protected routes.</li>
    <li>Passwords are hashed with bcrypt before storing in the database.</li>
    <li>Ensure PostgreSQL is running and the connection string is correct.</li>
  </ul>


  </code></pre>


  <h2> Author</h2>
  <p><strong>Salman Shaid</strong></p>
  <ul>
    <li>GitHub: <a href="https://github.com/Salman-Shaid" target="_blank">https://github.com/Salman-Shaid</a></li>
    <li>Email: salmanshaid9@gmail.com</li>
  </ul>

</body>
</html>
