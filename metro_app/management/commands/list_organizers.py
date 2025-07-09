from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'List all organizer users'

    def handle(self, *args, **options):
        organizers = User.objects.filter(user_type='organizer')
        
        if not organizers.exists():
            self.stdout.write(
                self.style.WARNING('No organizer users found.')
            )
            return
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n📋 ORGANIZER USERS ({organizers.count()} found)\n'
                f'================================\n'
            )
        )
        
        for i, organizer in enumerate(organizers, 1):
            status = "Active" if organizer.is_active else "Inactive"
            admin_access = "Yes" if organizer.is_staff else "No"
            
            self.stdout.write(
                f'{i}. Username: {organizer.username}\n'
                f'   Email: {organizer.email}\n'
                f'   Name: {organizer.get_full_name() or "Not set"}\n'
                f'   Status: {status}\n'
                f'   Admin Access: {admin_access}\n'
                f'   Created: {organizer.date_joined.strftime("%Y-%m-%d %H:%M")}\n'
                f'   Last Login: {organizer.last_login.strftime("%Y-%m-%d %H:%M") if organizer.last_login else "Never"}\n'
                f'   {"-" * 30}\n'
            )
