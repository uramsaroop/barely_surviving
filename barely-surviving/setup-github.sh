#!/bin/bash

# Barely Surviving - GitHub Upload Script
# This script will help you upload the project to GitHub

echo "🚀 Barely Surviving - GitHub Upload Helper"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first:"
    echo "   - macOS: brew install git"
    echo "   - Ubuntu: sudo apt-get install git"
    echo "   - Windows: Download from https://git-scm.com/"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if we're already in a git repo
if [ -d .git ]; then
    echo "⚠️  This directory is already a git repository."
    read -p "Do you want to remove the existing .git and start fresh? (yes/no): " remove_git
    if [ "$remove_git" = "yes" ]; then
        rm -rf .git
        echo "✅ Removed existing git repository"
    else
        echo "Keeping existing repository. Exiting."
        exit 0
    fi
fi

echo "📋 Let's set up your GitHub repository!"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " github_username

# Get repository name
read -p "Enter repository name (default: barely-surviving): " repo_name
repo_name=${repo_name:-barely-surviving}

# Ask if repo should be private
read -p "Should this be a private repository? (yes/no, default: yes): " is_private
is_private=${is_private:-yes}

echo ""
echo "📝 Summary:"
echo "   Username: $github_username"
echo "   Repository: $repo_name"
echo "   Private: $is_private"
echo ""
read -p "Is this correct? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled. Please run the script again."
    exit 0
fi

echo ""
echo "🔧 Setting up local git repository..."

# Initialize git
git init
git branch -M main

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Barely Surviving

Complete fitness tracking application with:
- FastAPI backend with MongoDB
- React frontend with Daily Ritual design
- Kubernetes deployment configurations
- Docker setup for local development

Phase 1: Core features (workouts, meals, weight, goals)
Phase 2: AI nutrition features (planned)
Phase 3: Apple Watch integration (planned)"

echo "✅ Local git repository created"
echo ""

# Create GitHub repository URL
repo_url="https://github.com/${github_username}/${repo_name}.git"

echo "📦 Next Steps:"
echo ""
echo "1. Create the GitHub repository:"
echo "   Go to: https://github.com/new"
echo "   - Repository name: $repo_name"
if [ "$is_private" = "yes" ]; then
    echo "   - Visibility: Private"
else
    echo "   - Visibility: Public"
fi
echo "   - DO NOT initialize with README, .gitignore, or license"
echo "   - Click 'Create repository'"
echo ""
echo "2. Then run these commands:"
echo ""
echo "   git remote add origin $repo_url"
echo "   git push -u origin main"
echo ""
echo "Or run this script's push helper:"
echo "   ./github-push.sh"
echo ""

# Create a push helper script
cat > github-push.sh << EOF
#!/bin/bash
git remote add origin $repo_url 2>/dev/null || git remote set-url origin $repo_url
git push -u origin main
EOF

chmod +x github-push.sh

echo "✅ Created github-push.sh helper script"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "After creating the repository on GitHub, run:"
echo "   ./github-push.sh"
