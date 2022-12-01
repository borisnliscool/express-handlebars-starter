#!/bin/bash

rm -rf dist

sass src/public/styles/style.scss dist/style/style.css 
uglifyjs-folder src/public/scripts/ -o dist/scripts/ -e -x .js

cp src/public/files/*.* dist