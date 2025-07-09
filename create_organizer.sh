#!/bin/bash

# Quick script to create organizer credentials
echo "🚀 Creating new organizer credentials..."
echo "========================================"

# Activate virtual environment if it exists
if [ -d "metro_env" ]; then
    source metro_env/bin/activate
    echo "✅ Virtual environment activated"
fi

# Create new organizer
python manage.py quick_organizer

echo ""
echo "🎯 You can also use these commands:"
echo "   python manage.py create_organizer          # Create with random credentials"
echo "   python manage.py list_organizers           # List all organizers"
echo "   python manage.py reset_organizer_password <username>  # Reset password"
echo ""
echo "📝 All credentials are saved in 'organizer_credentials.txt'"
