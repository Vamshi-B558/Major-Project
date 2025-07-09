@echo off
echo 🚀 Creating new organizer credentials...
echo ========================================

REM Activate virtual environment if it exists
if exist "metro_env" (
    call metro_env\Scripts\activate
    echo ✅ Virtual environment activated
)

REM Create new organizer
python manage.py quick_organizer

echo.
echo 🎯 You can also use these commands:
echo    python manage.py create_organizer          # Create with random credentials
echo    python manage.py list_organizers           # List all organizers
echo    python manage.py reset_organizer_password ^<username^>  # Reset password
echo.
echo 📝 All credentials are saved in 'organizer_credentials.txt'
pause
