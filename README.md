# GeniusPDF
A PDF viewer with local word look-up functionality.

A freelance project I took part in that renders a PDF with a special functionality. Annotations appear in the side bar with the definition of a word occurring anywhere in the PDF. The word to be looked up should preceeded or followed by certain keywords atleast once in the PDF. These keywords are matched via a regular expression provided by the user.

## Functionalities:

1. PDF Rendering
2. Local Word Lookup
3. Annotation Side-Bar
4. Scrollable PDF
5. Selectable Text
6. Search Function

## Instructions: 

1. Download and install node.js and git on your system
2. Open git bash as an administrator in an empty directory
3. Run npm install electron -g on git bash
4. Run npm install create-electron-app -g on bash
5. Run create-electron-app GeniusPDF
6. Copy the source files provided to you, to the src folder present in the GeniusPDF app folder
7. in package.json change "main": "src/index.js" to "main": "src/main.js"
8. Create a folder named extraResources and place the config.json file provided inside the folder.
9. Run npm start to see if it works properly
10. Run npm run make to create the executable directory which would be in the out/ folder.
