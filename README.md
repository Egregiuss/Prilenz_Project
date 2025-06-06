# Prilenz Photography

A beautiful photography portfolio website built with React and automatically deployed to GitHub Pages.

## Features

- Responsive design that works on all devices
- Beautiful image gallery with hover effects
- Contact form
- About section
- Modern and clean UI

## Setup Instructions

### 1. Push Your Code to GitHub

```bash
# Initialize git repository
git init

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit"

# Add the GitHub repository as remote
git remote add origin https://github.com/Egregiuss/Prilenz_Project.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "Pages" section
4. Under "Source", select "GitHub Actions"
5. Your site will be published at `https://egregiuss.github.io/Prilenz_Project/`

## Customizing Your Website

### Changing Images

To change the images, edit the `app.js` file and update the `sampleImages` array with your own image URLs:

```javascript
const sampleImages = [
  {
    id: 1,
    url: 'YOUR_IMAGE_URL_HERE',
    title: 'YOUR_IMAGE_TITLE',
    description: 'YOUR_IMAGE_DESCRIPTION'
  },
  // Add more images...
];
```

### Updating Content

You can update the text content by editing the components in the `app.js` file.

## Technologies Used

- HTML5
- CSS3
- React
- GitHub Actions for CI/CD
- GitHub Pages for hosting