from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import random
import string

User = get_user_model()

class Command(BaseCommand):
    help = 'Quickly create an organizer with simple credentials'

    def generate_simple_credentials(self):
        """Generate simple, memorable credentials"""
        adjectives = ['admin', 'super', 'main', 'chief', 'lead', 'head']
        nouns = ['organizer', 'manager', 'admin', 'user', 'metro']
        
        username = f"{random.choice(adjectives)}{random.choice(nouns)}{random.randint(1, 99)}"
        password = f"metro{random.randint(100, 999)}"
        
        return username, password

    def handle(self, *args, **options):
        username, password = self.generate_simple_credentials()
        
        # Ensure username is unique
        while User.objects.filter(username=username).exists():
            username, password = self.generate_simple_credentials()
        
        # Create the organizer user
        user = User.objects.create_user(
            username=username,
            password=password,
            user_type='organizer',
            first_name='Quick',
            last_name='Organizer',
            email=f'{username}@metro.com',
            is_staff=True,
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n⚡ QUICK ORGANIZER CREATED!\n'
                f'==========================\n'
                f'Username: {username}\n'
                f'Password: {password}\n'
                f'==========================\n'
                f'Ready to use immediately!\n'
            )
        )
