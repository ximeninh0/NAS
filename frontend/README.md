# NAS Drive - Frontend

A simple, beautiful Google Drive-like frontend for managing your files on the NAS (Network
Attached Storage) platform. Built with React and Vite.

This frontend is designed to run inside a multi-VM Vagrant environment, communicating with the
backend API VM.

---

## 🐳 Running inside the Vagrant Environment

The project is structured to run inside a multi-VM configuration managed by Vagrant:
- **Frontend VM (`frontend`):** IP `10.20.30.1`, maps guest port `80` to host port `8080`.
- **Backend VM (`backend`):** IP `10.20.30.2:8000`.
- **Database VM (`database`):** IP `10.20.30.3:3306`.
- **Storage VM (`storage`):** IP `10.20.30.4`.

### Step 1: Configure Backend Environment Variables

Ensure that your `backend/.env` file contains the correct environment variables for database
connections and shared storage:

### Step 2: Start the VMs

At the project root directory, spin up all VMs:
```bash
vagrant up
```

### Step 3: Access the Application

Once the Vagrant VMs are successfully running, open your web browser on your host machine and go to:
```text
http://localhost:8080
```

From the UI, you can:
- **Register & Login:** Create an account to receive your JWT security token.
- **Upload Files:** Choose a local file and click "Upload" (it will be saved to the shared NAS storage).
- **Download & Delete:** Download any listed file directly or delete it from the storage.
