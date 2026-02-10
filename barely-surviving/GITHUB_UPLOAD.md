# How to Upload Barely Surviving to GitHub

## Quick Method (Recommended)

1. **Download the `barely-surviving` folder** from this chat to your computer

2. **Open Terminal** (Mac/Linux) or **Git Bash** (Windows) and navigate to the folder:
   ```bash
   cd /path/to/barely-surviving
   ```

3. **Run the setup script**:
   ```bash
   ./setup-github.sh
   ```
   
   This will:
   - Initialize git
   - Create initial commit
   - Guide you through GitHub setup

4. **Create the repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `barely-surviving`
   - Make it **Private**
   - **DO NOT** check "Initialize with README"
   - Click "Create repository"

5. **Push to GitHub**:
   ```bash
   ./github-push.sh
   ```

Done! 🎉

## Manual Method

If you prefer to do it manually:

```bash
# 1. Navigate to the project
cd barely-surviving

# 2. Initialize git
git init
git branch -M main

# 3. Add all files
git add .

# 4. Create first commit
git commit -m "Initial commit - Barely Surviving"

# 5. Create repo on GitHub (https://github.com/new)
#    Name: barely-surviving
#    Private: yes
#    Don't initialize with anything

# 6. Add remote and push (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/barely-surviving.git
git push -u origin main
```

## What Gets Uploaded

✅ **These will be uploaded:**
- All source code
- README and documentation
- Docker configurations
- Kubernetes manifests
- `.env.example` files (safe templates)

❌ **These will NOT be uploaded** (protected by .gitignore):
- `.env` files (your secrets)
- `node_modules/`
- `venv/` (Python virtual environment)
- `__pycache__/`
- Build artifacts

## Verify It Worked

After uploading, visit:
```
https://github.com/YOUR_USERNAME/barely-surviving
```

You should see:
- README.md displayed
- All your folders (backend, frontend, k8s, scripts)
- Your commit message

## Add Collaborators (Optional)

If you want to share with others:
1. Go to your repo on GitHub
2. Click "Settings"
3. Click "Collaborators"
4. Add people by username or email

## Need Help?

If you get an error like "permission denied":
1. Make sure you're logged into GitHub
2. You might need to set up SSH keys or use a Personal Access Token
3. GitHub guide: https://docs.github.com/en/authentication

If you get "remote already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/barely-surviving.git
git push -u origin main
```

## Next Steps After Upload

1. **Clone on another machine**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/barely-surviving.git
   ```

2. **Set up environment**:
   ```bash
   cd barely-surviving
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit .env files with your settings
   ```

3. **Run the app**:
   ```bash
   docker-compose up
   ```

🎉 Your code is now safely on GitHub and you can work on it from anywhere!
