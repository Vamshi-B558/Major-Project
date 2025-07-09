from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import random
import string

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a new organizer user with random credentials'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            help='Specify username (optional, will generate random if not provided)',
        )
        parser.add_argument(
            '--password',
            type=str,
            help='Specify password (optional, will generate random if not provided)',
        )

    def generate_random_string(self, length=8):
        """Generate a random string of specified length"""
        letters = string.ascii_lowercase + string.digits
        return ''.join(random.choice(letters) for i in range(length))

    def handle(self, *args, **options):
        # Generate or use provided credentials
        username = options['username'] or f"organizer_{self.generate_random_string(6)}"
        password = options['password'] or self.generate_random_string(10)
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            username = f"organizer_{self.generate_random_string(8)}"
        
        # Create the organizer user
        user = User.objects.create_user(
            username=username,
            password=password,
            user_type='organizer',
            first_name='System',
            last_name='Organizer',
            email=f'{username}@metro.com',
            is_staff=True,  # Give admin access
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎉 NEW ORGANIZER CREATED SUCCESSFULLY!\n'
                f'================================\n'
                f'Username: {username}\n'
                f'Password: {password}\n'
                f'Email: {user.email}\n'
                f'Type: Organizer\n'
                f'Admin Access: Yes\n'
                f'================================\n'
                f'Use these credentials to login to the organizer dashboard.\n'
            )
        )
        
        # Also save to a file for reference
        with open('organizer_credentials.txt', 'a') as f:
            f.write(f'\n--- Generated on {user.date_joined} ---\n')
            f.write(f'Username: {username}\n')
            f.write(f'Password: {password}\n')
            f.write(f'Email: {user.email}\n')
            f.write(f'Status: Active\n')
            f.write('-' * 40 + '\n')
        
        self.stdout.write(
            self.style.WARNING(
                f'📝 Credentials also saved to: organizer_credentials.txt\n'
            )
        )
