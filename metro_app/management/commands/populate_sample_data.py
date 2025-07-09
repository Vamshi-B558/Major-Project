from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from metro_app.models import MetroStation, PredictionRequest, PredictionResult
import random
from datetime import date, time, datetime, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        # Create sample users
        if not User.objects.filter(username='admin_organizer').exists():
            User.objects.create_user(
                username='admin_organizer',
                email='admin@metro.com',
                password='metro123',
                user_type='organizer',
                first_name='Admin',
                last_name='Organizer'
            )
            self.stdout.write('Created organizer user')

        if not User.objects.filter(username='demo_user').exists():
            User.objects.create_user(
                username='demo_user',
                email='user@metro.com',
                password='metro123',
                user_type='cloud_user',
                first_name='Demo',
                last_name='User'
            )
            self.stdout.write('Created cloud user')

        # Create metro stations
        stations_data = [
            ('Central Station', 'CS', 'Delhi', 'Red Line'),
            ('North Station', 'NS', 'Delhi', 'Blue Line'),
            ('South Station', 'SS', 'Delhi', 'Yellow Line'),
            ('East Station', 'ES', 'Delhi', 'Green Line'),
            ('West Station', 'WS', 'Delhi', 'Violet Line'),
            ('Andheri', 'AND', 'Mumbai', 'Western Line'),
            ('Bandra', 'BAN', 'Mumbai', 'Western Line'),
            ('Churchgate', 'CHG', 'Mumbai', 'Western Line'),
            ('Dadar', 'DDR', 'Mumbai', 'Central Line'),
            ('Kurla', 'KUR', 'Mumbai', 'Central Line'),
            ('Majestic', 'MJS', 'Bangalore', 'Purple Line'),
            ('Whitefield', 'WHF', 'Bangalore', 'Purple Line'),
            ('Electronic City', 'ELC', 'Bangalore', 'Green Line'),
            ('Indiranagar', 'ING', 'Bangalore', 'Blue Line'),
            ('Koramangala', 'KOR', 'Bangalore', 'Blue Line'),
        ]

        for name, code, city, line in stations_data:
            MetroStation.objects.get_or_create(
                code=code,
                defaults={'name': name, 'city': city, 'line': line}
            )

        self.stdout.write('Created metro stations')

        # Create sample predictions
        user = User.objects.get(username='demo_user')
        stations = list(MetroStation.objects.all())
        
        for i in range(50):
            source = random.choice(stations)
            destination = random.choice([s for s in stations if s != source])
            
            request = PredictionRequest.objects.create(
                user=user,
                fid=f'FID{1000+i}',
                trip_id=f'TRP{2000+i}',
                metro_name=f'{source.line}',
                city=source.city,
                source_station=source,
                destination_station=destination,
                date=date.today() - timedelta(days=random.randint(0, 30)),
                time=time(random.randint(6, 22), random.randint(0, 59)),
                number_of_boardings=random.randint(50, 500)
            )
            
            predicted_flow = random.randint(1000, 5000)
            flow_type = 'High' if predicted_flow > 3500 else 'Medium' if predicted_flow > 2000 else 'Low'
            
            PredictionResult.objects.create(
                request=request,
                predicted_flow=predicted_flow,
                flow_type=flow_type,
                accuracy=random.uniform(85, 98)
            )

        self.stdout.write('Created sample predictions')
        self.stdout.write(self.style.SUCCESS('Sample data populated successfully!'))
