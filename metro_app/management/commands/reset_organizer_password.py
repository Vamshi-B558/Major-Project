from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import random
import string

User = get_user_model()

class Command(BaseCommand):
    help = 'Reset password for an existing organizer'

    def add_arguments(self, parser):
        parser.add_argument(
            'username',
            type=str,
            help='Username of the organizer to reset password for',
        )
        parser.add_argument(
            '--password',
            type=str,
            help='New password (optional, will generate random if not provided)',
        )

    def generate_random_string(self, length=10):
        """Generate a random string of specified length"""
        letters = string.ascii_lowercase + string.digits
        return ''.join(random.choice(letters) for i in range(length))

    def handle(self, *args, **options):
        username = options['username']
        new_password = options['password'] or self.generate_random_string(10)
        
        try:
            user = User.objects.get(username=username, user_type='organizer')
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(
                    f'❌ Organizer with username "{username}" not found.'
                )
            )
            return
        
        # Reset the password
        user.set_password(new_password)
        user.save()
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n🔄 PASSWORD RESET SUCCESSFUL!\n'
                f'================================\n'
                f'Username: {username}\n'
                f'New Password: {new_password}\n'
                f'Email: {user.email}\n'
                f'================================\n'
            )
        )
        
        # Save to credentials file
        with open('organizer_credentials.txt', 'a') as f:
            f.write(f'\n--- Password Reset on {user.date_joined} ---\n')
            f.write(f'Username: {username}\n')
            f.write(f'New Password: {new_password}\n')
            f.write(f'Email: {user.email}\n')
            f.write(f'Action: Password Reset\n')
            f.write('-' * 40 + '\n')
