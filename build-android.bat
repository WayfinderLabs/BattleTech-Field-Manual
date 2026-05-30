@echo off
cd /D "C:\Users\X1 Carbon\Projects\battletech-field-manual"

echo ========================================
echo  BTFM Android Build Script
echo ========================================
echo.

:: [1] Set Java home
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot
echo [1/8] JAVA_HOME set to %JAVA_HOME%
echo.

:: [2] Pull latest from GitHub
echo [2/8] Pulling latest from GitHub...
git pull origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git pull failed. Resolve conflicts before building.
    pause
    exit /b 1
)
echo.

:: [3] npm build
echo [3/8] Running npm build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm build failed. Aborting.
    pause
    exit /b 1
)
echo.

:: [4] Capacitor sync
echo [4/8] Running cap sync...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: cap sync failed. Aborting.
    pause
    exit /b 1
)
echo.

:: [5] Clear Gradle cache
echo [5/8] Clearing Gradle cache...
rmdir /S /Q android\.gradle 2>nul
rmdir /S /Q android\app\build 2>nul
echo Gradle cache cleared.
echo.

:: [6] Remove Capacitor default drawables
echo [6/8] Removing Capacitor default drawables...
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

:: [7] Deploy custom icons
echo [7/8] Deploying custom icons...
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

:: [8] Restore critical Android files
echo [8/8] Restoring critical Android files...
copy /Y "android-patches\MainActivity.java"    "android\app\src\main\java\com\wayfinderlabs\btfm\MainActivity.java"
copy /Y "android-patches\styles.xml"           "android\app\src\main\res\values\styles.xml"
copy /Y "android-patches\AndroidManifest.xml"  "android\app\src\main\AndroidManifest.xml"
echo Critical files restored.
echo.

echo ========================================
echo  Build complete. Next steps:
echo.
echo  1. Check android\variables.gradle
echo     compileSdkVersion=35, targetSdkVersion=35
echo  2. Increment versionCode in android\app\build.gradle
echo  3. Android Studio: Build ^> Generate Signed Bundle
echo.
echo  NEVER run Clean Project.
echo  NEVER run cap sync after this script.
echo ========================================
echo.
pause