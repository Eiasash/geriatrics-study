@echo off
echo Starting local deployment to gh-pages...

REM Build H5P packages
echo Building H5P packages...
cd h5p
call npm run build
call npm run build:qset
call npm run build:mega
cd ..

REM Create gh-pages branch with content
echo Deploying to gh-pages branch...

REM Switch to gh-pages or create it
git checkout gh-pages 2>nul || git checkout --orphan gh-pages

REM Remove all tracked files
git rm -rf . 2>nul

REM Copy H5P files
xcopy /E /I /Y h5p\dist dist
copy /Y h5p\index.html index.html
copy /Y h5p\timer-embed.html timer-embed.html
copy /Y h5p\README.md README.md

REM Create root index
echo ^<!DOCTYPE html^>^<html^>^<head^>^<meta charset="utf-8"^>^<title^>Geriatrics Study^</title^>^<meta http-equiv="refresh" content="0; url=index.html"^>^</head^>^<body^>^<h1^>Redirecting to H5P Content Hub...^</h1^>^</body^>^</html^> > root-index.html

REM Add all files
git add .

REM Commit
git commit -m "Deploy H5P content to GitHub Pages"

REM Push to gh-pages
git push origin gh-pages --force

REM Switch back to original branch
git checkout feat/advanced-cicd

echo.
echo Deployment complete!
echo Your site will be available at: https://eiasash.github.io/geriatrics-study/
echo.
pause