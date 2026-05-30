@echo off
cd /D "C:\Users\X1 Carbon\Projects\battletech-field-manual"
echo ========================================
echo  BTFM Android Build Script
echo ========================================
echo.

:: Set Java home - required every session
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot
echo [1/6] JAVA_HOME set to %JAVA_HOME%
echo.

:: Run web build
echo [2/6] Running npm build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm build failed. Aborting.
    pause
    exit /b 1
)
echo.

:: Sync to Android
echo [3/6] Running cap sync...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: cap sync failed. Aborting.
    pause
    exit /b 1
)
echo.

:: Clear Gradle build cache to prevent stale compiled resources
echo [4/6] Clearing Gradle cache...
rmdir /S /Q android\.gradle 2>nul
rmdir /S /Q android\app\build 2>nul
echo Gradle cache cleared.
echo.

:: Kill Capacitor default vector drawables - these override mipmap icons on API 24+ devices
echo [5/6] Removing Capacitor default drawables...
del /F /Q android\app\src\main\res\drawable-v24\ic_launcher_foreground.xml 2>nul
del /F /Q android\app\src\main\res\drawable\ic_launcher_background.xml 2>nul

:: Replace background with plain black shape
echo ^<?xml version="1.0" encoding="utf-8"?^> > android\app\src\main\res\drawable\ic_launcher_background.xml
echo ^<shape xmlns:android="http://schemas.android.com/apk/res/android"^> >> android\app\src\main\res\drawable\ic_launcher_background.xml
echo ^<solid android:color="#000000"/^> >> android\app\src\main\res\drawable\ic_launcher_background.xml
echo ^</shape^> >> android\app\src\main\res\drawable\ic_launcher_background.xml
echo Capacitor default drawables removed.
echo.

:: Deploy icons AFTER sync and cache clear
echo [6/6] Deploying custom icons...

set ICON_SRC=C:\Users\X1 Carbon\Desktop\Side Projects\BattleTech Field Manual\Images\BTFM_Icons_Final
set RES=android\app\src\main\res

:: mdpi
copy /Y "%ICON_SRC%\mipmap-mdpi_48.png"          "%RES%\mipmap-mdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-mdpi_48.png"          "%RES%\mipmap-mdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-mdpi\ic_launcher_foreground.png"

:: hdpi
copy /Y "%ICON_SRC%\mipmap-hdpi_72.png"          "%RES%\mipmap-hdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-hdpi_72.png"          "%RES%\mipmap-hdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-hdpi\ic_launcher_foreground.png"

:: xhdpi
copy /Y "%ICON_SRC%\mipmap-xhdpi_96.png"         "%RES%\mipmap-xhdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-xhdpi_96.png"         "%RES%\mipmap-xhdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-xhdpi\ic_launcher_foreground.png"

:: xxhdpi
copy /Y "%ICON_SRC%\mipmap-xxhdpi_144.png"       "%RES%\mipmap-xxhdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-xxhdpi_144.png"       "%RES%\mipmap-xxhdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-xxhdpi\ic_launcher_foreground.png"

:: xxxhdpi
copy /Y "%ICON_SRC%\mipmap-xxxhdpi_192.png"      "%RES%\mipmap-xxxhdpi\ic_launcher.png"
copy /Y "%ICON_SRC%\mipmap-xxxhdpi_192.png"      "%RES%\mipmap-xxxhdpi\ic_launcher_round.png"
copy /Y "%ICON_SRC%\adaptive_foreground_432.png"  "%RES%\mipmap-xxxhdpi\ic_launcher_foreground.png"

echo.
echo ========================================
echo  Build + icon deploy complete.
echo.
echo  NEXT STEPS IN ANDROID STUDIO:
echo  1. Increment versionCode in build.gradle
echo  2. Build ^> Generate Signed Bundle
echo  DO NOT run Clean Project.
echo  DO NOT run cap sync again after this.
echo ========================================
echo.
pause
