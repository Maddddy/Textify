# GitHub Repository Setup

Follow these steps to create a GitHub repository and push your Testify Chatbot project.

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `testify-chatbot`
   - **Description**: `A modern chatbot application built with React, Nhost, Hasura, and n8n`
   - **Visibility**: Choose Public or Private
   - **Initialize with**: Leave unchecked
5. Click **"Create repository"**

## Step 2: Initialize Local Git Repository

```bash
cd testify
git init
```

## Step 3: Add Remote Origin

```bash
git remote add origin https://github.com/YOUR_USERNAME/testify-chatbot.git
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## Step 4: Create .gitignore (if not exists)

The `.gitignore` file is already created, but verify it contains:

```gitignore
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
*.env

# Build files
build/
dist/
*/build/
*/dist/

# Nhost
.nhost/
nhost/.nhost/
nhost/data/
nhost/traefik/
```

## Step 5: Add and Commit Files

```bash
# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Testify Chatbot Application

- Complete React frontend with TypeScript
- Nhost backend with Hasura and Auth
- Database migrations and RLS policies
- n8n workflow for AI integration
- Comprehensive documentation
- Modern UI/UX design"
```

## Step 6: Push to GitHub

```bash
# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 7: Verify Repository

1. Go to your GitHub repository URL
2. Verify all files are uploaded
3. Check that the README.md displays correctly

## Step 8: Update Package.json (Optional)

Edit the `package.json` file to update repository URLs:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/testify-chatbot.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/testify-chatbot/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/testify-chatbot#readme"
}
```

Then commit and push:

```bash
git add package.json
git commit -m "Update repository URLs in package.json"
git push
```

## Step 9: Enable GitHub Pages (Optional)

If you want to host documentation on GitHub Pages:

1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Select **Source**: Deploy from a branch
4. Select **Branch**: main, **Folder**: / (root)
5. Click **Save**

## Step 10: Set Up Branch Protection (Recommended)

1. Go to repository **Settings**
2. Click **Branches** in left sidebar
3. Click **Add rule**
4. Set **Branch name pattern**: `main`
5. Check **Require a pull request before merging**
6. Check **Require status checks to pass before merging**
7. Click **Create**

## Repository Structure

Your GitHub repository should now contain:

```
testify-chatbot/
├── 📁 nhost/                 # Backend configuration
├── 📁 frontend/              # React application
├── 📄 n8n-workflow.json      # AI workflow
├── 📄 README.md              # Project documentation
├── 📄 DEPLOYMENT.md          # Deployment guide
├── 📄 QUICK_START.md         # Quick start guide
├── 📄 PROJECT_SUMMARY.md     # Project overview
├── 📄 GITHUB_SETUP.md        # This file
├── 📄 package.json           # Project configuration
└── 📄 .gitignore             # Git ignore rules
```

## Next Steps

1. **Deploy to Nhost Cloud**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Deploy to Netlify**: Connect your GitHub repository
3. **Set up CI/CD**: Configure automatic deployments
4. **Add collaborators**: Invite team members if needed

## Troubleshooting

### Authentication Issues
```bash
# Set up GitHub CLI or use personal access token
gh auth login
# OR
git remote set-url origin https://TOKEN@github.com/USERNAME/REPO.git
```

### Large Files
```bash
# If you have large files, use Git LFS
git lfs install
git lfs track "*.large-file-extension"
```

### Push Errors
```bash
# Force push if needed (use with caution)
git push -f origin main

# Or reset and start over
git reset --hard HEAD~1
git push -f origin main
```

## Repository Features

- **Issues**: Track bugs and feature requests
- **Projects**: Organize work with kanban boards
- **Actions**: Set up CI/CD workflows
- **Wiki**: Add additional documentation
- **Discussions**: Community engagement

---

**Your repository is now ready!** 🎉

Continue with the [DEPLOYMENT.md](DEPLOYMENT.md) guide to deploy your application.
