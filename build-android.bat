@echo off
cd /D "C:\Users\X1 Carbon\Projects\battletech-field-manual"

echo ========================================
echo  BTFM Android Build Script
echo ========================================
echo.

:: ── LOG: Build session start ──────────────────────────────────────────────────
set "LOGFILE=build-log.txt"
echo [%date% %time%] BUILD STARTED >> %LOGFILE%

:: [1] Set Java home
:: Verify this path matches Android Studio > Settings > Build Tools > Gradle > Gradle JDK
set JAVA_HOME=C:\Android\Android Studio\jbr
echo [1/9] JAVA_HOME set to %JAVA_HOME%
echo.

:: [2] Pull latest from GitHub
echo [2/9] Pulling latest from GitHub...
git pull origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git pull failed. Resolve conflicts before building.
    echo [%date% %time%] BUILD FAILED - git pull >> %LOGFILE%
    pause
    exit /b 1
)
echo.

:: [3] Install npm dependencies
echo [3/9] Installing npm dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed. Aborting.
    echo [%date% %time%] BUILD FAILED - npm install >> %LOGFILE%
    pause
    exit /b 1
)
echo.

:: [4] npm build
echo [4/9] Running npm build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm build failed. Aborting.
    echo [%date% %time%] BUILD FAILED - npm build >> %LOGFILE%
    pause
    exit /b 1
)
echo.

:: [5] Capacitor sync
echo [5/9] Running cap sync...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: cap sync failed. Aborting.
    echo [%date% %time%] BUILD FAILED - cap sync >> %LOGFILE%
    pause
    exit /b 1
)
echo.

:: [6] Clear Gradle cache
echo [6/9] Clearing Gradle cache...
rmdir /S /Q android\.gradle 2>nul
rmdir /S /Q android\app\build 2>nul
echo Gradle cache cleared.
echo.

:: [7] Remove Capacitor default drawables
echo [7/9] Removing Capacitor default drawables...
del /F /Q "android\app\src\main\res\drawable-v24\ic_launcher_foreground.xml" 2>nul
del /F /Q "android\app\src\main\res\drawable\ic_launcher_background.xml" 2>nul
(
    echo ^<?xml version="1.0" encoding="utf-8"?^>
    echo ^<shape xmlns:android="http://schemas.android.com/apk/res/android"^>
    echo ^<solid android:color="#000000"/^>
    echo ^</shape^>
) > "android\app\src\main\res\drawable\ic_launcher_background.xml"
echo Capacitor default drawables removed.
echo.

:: [8] Deploy custom icons
echo [8/9] Deploying custom icons...
set "ICON_SRC=C:\Users\X1 Carbon\Desktop\Side Projects\BattleTech Field Manual\Images\BTFM_Icons_Final"
set "RES=android\app\src\main\res"
copy /Y "%ICON_SRC%\mipmap-mdpi_48.png"          "%RES%\mipmap-mdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-mdpi_48.png"          "%RES%\mipmap-mdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-mdpi\ic_launcher_foreground.png"
copy /Y "%ICON_SRC%\mipmap-hdpi_72.png"          "%RES%\mipmap-hdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-hdpi_72.png"          "%RES%\mipmap-hdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-hdpi\ic_launcher_foreground.png"
copy /Y "%ICON_SRC%\mipmap-xhdpi_96.png"         "%RES%\mipmap-xhdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-xhdpi_96.png"         "%RES%\mipmap-xhdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-xhdpi\ic_launcher_foreground.png"
copy /Y "%ICON_SRC%\mipmap-xxhdpi_144.png"       "%RES%\mipmap-xxhdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-xxhdpi_144.png"       "%RES%\mipmap-xxhdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-xxhdpi\ic_launcher_foreground.png"
copy /Y "%ICON_SRC%\mipmap-xxxhdpi_192.png"      "%RES%\mipmap-xxxhdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-xxxhdpi_192.png"      "%RES%\mipmap-xxxhdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-xxxhdpi\ic_launcher_foreground.png"
echo Icons deployed.
echo.

:: [9] Restore critical Android files
echo [9/9] Restoring critical Android files...
if not exist "android-patches\MainActivity.java" (
    echo ERROR: android-patches\MainActivity.java is missing. Aborting.
    pause
    exit /b 1
)
copy /Y "android-patches\MainActivity.java"    "android\app\src\main\java\com\wayfinderlabs\btfm\MainActivity.java"
if not exist "android-patches\styles.xml" (
    echo ERROR: android-patches\styles.xml is missing. Aborting.
    pause
    exit /b 1
)
copy /Y "android-patches\styles.xml"           "android\app\src\main\res\values\styles.xml"
if not exist "android-patches\AndroidManifest.xml" (
    echo ERROR: android-patches\AndroidManifest.xml is missing. Aborting.
    pause
    exit /b 1
)
copy /Y "android-patches\AndroidManifest.xml"  "android\app\src\main\AndroidManifest.xml"

if not exist "android-patches\variables.gradle" (
    echo ERROR: android-patches\variables.gradle is missing. Aborting.
    pause
    exit /b 1
)
copy /Y "android-patches\variables.gradle"    "android\variables.gradle"

if not exist "android-patches\build.gradle" (
    echo ERROR: android-patches\build.gradle is missing. Aborting.
    pause
    exit /b 1
)
copy /Y "android-patches\build.gradle"         "android\build.gradle"

if not exist "android-patches\gradle.properties" (
    echo ERROR: android-patches\gradle.properties is missing. Aborting.
    pause
    exit /b 1
)
copy /Y "android-patches\gradle.properties"    "android\gradle.properties"

if not exist "android-patches\gradle-wrapper.properties" (
    echo ERROR: android-patches\gradle-wrapper.properties is missing. Aborting.
    pause
    exit /b 1
)
copy /Y "android-patches\gradle-wrapper.properties"  "android\gradle\wrapper\gradle-wrapper.properties"

echo Critical files restored.
echo.

:: ── VERSION CODE: Read current, confirm increment ─────────────────────────────
echo ========================================
echo  VERSION CODE MANAGEMENT
echo ========================================

for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content 'android\app\build.gradle' | Select-String 'versionCode\s+\d+').Matches[0].Value -replace 'versionCode\s+','' "') do set "CURRENT_VC=%%i"

echo  Current versionCode in build.gradle: %CURRENT_VC%
set /a NEXT_VC=%CURRENT_VC%+1
echo  Suggested next versionCode:          %NEXT_VC%
echo.
set /p CONFIRM_VC="  Enter new versionCode (press Enter to use %NEXT_VC%, or type a different number): "

if "%CONFIRM_VC%"=="" set "CONFIRM_VC=%NEXT_VC%"

echo.
echo  Writing versionCode %CONFIRM_VC% to build.gradle...
powershell -NoProfile -Command "(Get-Content 'android\app\build.gradle') -replace 'versionCode\s+%CURRENT_VC%', 'versionCode %CONFIRM_VC%' | Set-Content 'android\app\build.gradle'"
echo  Done.
echo.

echo  Creating CHANGELOG.md entry for versionCode %CONFIRM_VC%...

set "CLFILE=CHANGELOG.md"
set "CLTMP=changelog_tmp.md"

(
    echo ## versionCode %CONFIRM_VC% - %date%
    echo - [ ] describe change 1
    echo - [ ] describe change 2
    echo.
) > %CLTMP%

if exist %CLFILE% (
    type %CLFILE% >> %CLTMP%
)
move /Y %CLTMP% %CLFILE% >nul
echo  CHANGELOG.md updated. Fill in the entries before your next git push.
echo.

echo [%date% %time%] versionCode %CONFIRM_VC% written to build.gradle >> %LOGFILE%

echo ========================================
echo  Build complete. Next steps:
echo.
echo  1. Verify android\variables.gradle:
echo     compileSdkVersion=36, targetSdkVersion=36
echo  2. Android Studio: Build ^> Generate Signed Bundle
echo  3. Upload AAB to Play Console internal track
echo  4. After successful device test - come back and
echo     run TAG-AND-PUSH.bat to tag this version in Git
echo.
echo  NEVER run Clean Project.
echo  NEVER run cap sync after this script.
echo ========================================
echo.
echo [%date% %time%] Build script completed for versionCode %CONFIRM_VC% >> %LOGFILE%
pause
