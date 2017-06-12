
function Initialize-Repository(){
    npm install
    Update-Package
    Update-Gulpfile
}

function Update-Package(){
    # Clean lib folder and self reference folder
    Remove-Item ./lib, ./node_modules/gulp-structify -Recurse -ErrorAction Ignore
    # Transpile src files (with "outDir" set to lib folder)
    tsc --project ./src/tsconfig.json
    # Copy package files to lib folder
    Copy-Item -Path package.json, README.md, LICENSE -Destination ./lib
    # Copy lib folder to node_modules (for self reference)
    Copy-Item -Path ./lib -Destination ./node_modules/gulp-structify -Recurse
}

function Update-Gulpfile(){
    tsc.cmd "$PSScriptRoot\gulpfile.ts"
}

function Update-Examples(){
    gulp update:examples
}

function Update-All(){
    Update-Package
    Update-Gulpfile
    Update-Examples
}

function Publish-Package(){
    Set-Location ./lib
    npm publish
    Set-Location ..
}