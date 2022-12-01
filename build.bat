if exist dist rmdir dist /q /s

call sass "src/public/styles/style.scss" "dist/style/style.css"
call uglifyjs-folder "src/public/scripts/" -o "dist/scripts/" -e -x .js

xcopy "src/public/files" "dist" /c /s /i 