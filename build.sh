#!/bin/bash

rm -rf dist

sass src/public/styles/style.scss dist/style/style.css 
tailwindcss -i dist/style/style.css -o dist/style/style.css --minify
uglifyjs-folder src/public/scripts/ -o dist/scripts/ -e -x .js

cp src/public/files/*.* dist