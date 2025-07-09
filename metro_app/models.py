from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class CustomUser(AbstractUser):
    USER_TYPES = (
        ('organizer', 'Organizer'),
        ('cloud_user', 'Cloud User'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='cloud_user')
    mobile = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    pin_code = models.CharField(max_length=10, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True)

class MetroStation(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    city = models.CharField(max_length=50)
    line = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.name} ({self.code})"

class PredictionRequest(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    fid = models.CharField(max_length=20)
    trip_id = models.CharField(max_length=20)
    metro_name = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    source_station = models.ForeignKey(MetroStation, on_delete=models.CASCADE, related_name='source_predictions')
    destination_station = models.ForeignKey(MetroStation, on_delete=models.CASCADE, related_name='destination_predictions')
    date = models.DateField()
    time = models.TimeField()
    number_of_boardings = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class PredictionResult(models.Model):
    FLOW_TYPES = (
        ('High', 'High Flow'),
        ('Medium', 'Medium Flow'),
        ('Low', 'Low Flow'),
    )
    
    request = models.OneToOneField(PredictionRequest, on_delete=models.CASCADE)
    predicted_flow = models.IntegerField()
    flow_type = models.CharField(max_length=10, choices=FLOW_TYPES)
    accuracy = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    processed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Prediction {self.request.fid} - {self.flow_type}"
