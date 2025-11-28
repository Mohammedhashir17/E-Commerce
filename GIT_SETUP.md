# Git Setup for Windows

## Option 1: Install Git for Windows (Recommended)

1. **Download Git:**
   - Go to: https://git-scm.com/download/win
   - Download the latest version for Windows
   - Run the installer

2. **During Installation:**
   - Use default settings (recommended)
   - Make sure "Git from the command line and also from 3rd-party software" is selected
   - Complete the installation

3. **Verify Installation:**
   - Close and reopen PowerShell/Command Prompt
   - Run: `git --version`
   - You should see the Git version number

4. **Configure Git (First Time):**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## Option 2: Use GitHub Desktop (GUI Alternative)

If you prefer a graphical interface:
1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. You can manage repositories through the GUI

## Option 3: Use Git through VS Code

If you have VS Code installed:
1. VS Code has built-in Git support
2. Open the Source Control panel (Ctrl+Shift+G)
3. Initialize repository from there

## Quick Start After Installation

Once Git is installed:

```bash
# Navigate to your project
cd "C:\Users\MD HASHIR A J\Desktop\E-commerce"

# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: E-commerce MERN stack application"

# (Optional) Connect to remote repository
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

## Troubleshooting

- **"git is not recognized"** after installation:
  - Close and reopen PowerShell/Command Prompt
  - Restart your computer if needed
  - Check if Git is in PATH: `$env:PATH` (should include Git\bin)

- **Permission issues:**
  - Run PowerShell as Administrator if needed

## Note

If you don't want to use Git, you can:
- Use VS Code's built-in source control
- Use GitHub Desktop (GUI)
- Skip version control for now (not recommended for production)


