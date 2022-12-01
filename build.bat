if exist dist rmdir dist /q /s

call sass "src/public/styles/style.scss" "dist/style/style.css"
call tailwindcss -i "dist/style/style.css" -o "dist/style/style.css" --minify
call uglifyjs-folder "src/public/scripts/" -o "dist/scripts/" -e -x .js

xcopy "src/public/files" "dist" /c /s /i 