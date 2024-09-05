# BroCode

BroCode is a real-time collaborative coding platform designed for seamless teamwork. It allows multiple users to work together on code, view live updates, interact through live video chat, and execute the code on Kubernetes pods. With robust message queuing using RabbitMQ, BroCode ensures reliable communication and smooth team collaboration.

## Key Features

- **Real-time Collaborative Coding**: 
  - Code in sync with your teammates using WebSockets for instant updates.
  
- **Live Video Chat**:
  - Interact with your team while coding through WebRTC-based video calls.

- **Kubernetes-powered Code Execution**:
  - Execute code on the fly using Kubernetes pods for scalable and isolated code execution environments.

- **Reliable Messaging**:
  - RabbitMQ ensures a reliable message queue system, ensuring all updates and messages are properly sent and received.

## Tech Stack

- **WebSockets**: For real-time updates in collaborative coding.
- **WebRTC**: For live video chat between users.
- **Kubernetes**: To run code in isolated, scalable environments.
- **RabbitMQ**: For reliable messaging and queuing.
- **Node.js**: Backend server and API.
- **React.js**: Frontend framework for user interaction.
- **Tailwind CSS**: For styling the frontend interface.
- **Docker**: For containerized environments.
- **MongoDB**: Database to store user data, code sessions, and other platform data.

## Getting Started

### Prerequisites

Ensure you have the following tools installed:

- **Node.js**: v14+ 
- **Docker**: v20+ 
- **Kubernetes**: v1.20+ 
- **RabbitMQ**: v3.8+
- **MongoDB**: v4.4+

### Installation

1. Clone the repository:
    ```bash
    git clone [https://github.com/your-username/brocode.git](https://github.com/ANUKULUNJ/BroCode.git)
    cd brocode
    ```

2. Install backend dependencies:
    ```bash
    cd backend
    npm install
    ```

3. Install frontend dependencies:
    ```bash
    cd frontend
    npm install
    ```

4. Setup MongoDB:
   - Ensure MongoDB is running locally or provide a remote connection URL in `.env`.

5. Setup RabbitMQ:
   - Ensure RabbitMQ is running and accessible from your development environment.

6. Run Kubernetes:
    ```bash
    kubectl apply -f k8s/deployment.yaml
    ```

### Running the Application

1. Start the backend server:
    ```bash
    cd backend
    npm run start
    ```

2. Start the frontend:
    ```bash
    cd frontend
    npm run start
    ```

3. Open the application in your browser at `http://localhost:3000`.

### Docker Setup (Optional)

1. Build the Docker images for the backend and frontend:
    ```bash
    docker-compose up --build
    ```

2. This will set up both the frontend and backend services along with MongoDB, RabbitMQ, and Kubernetes integration.

### Kubernetes Pod Execution

- Kubernetes pods will handle the real-time execution of code. The code input by the users is executed in an isolated environment, ensuring scalability and security.

### RabbitMQ Setup

- RabbitMQ is used to handle message queuing. This ensures that the updates from the code editor, chat, and video sessions are reliably transmitted to all users.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your improvements.

---

**BroCode** - Collaborate, Code, Communicate.
