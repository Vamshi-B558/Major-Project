from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, MetroStation, PredictionRequest, PredictionResult

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'mobile', 'address', 'date_of_birth', 'gender', 'pin_code', 'profile_picture')
        }),
    )

@admin.register(MetroStation)
class MetroStationAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'city', 'line')
    list_filter = ('city', 'line')
    search_fields = ('name', 'code')

@admin.register(PredictionRequest)
class PredictionRequestAdmin(admin.ModelAdmin):
    list_display = ('fid', 'user', 'source_station', 'destination_station', 'date', 'created_at')
    list_filter = ('city', 'date', 'created_at')
    search_fields = ('fid', 'trip_id')

@admin.register(PredictionResult)
class PredictionResultAdmin(admin.ModelAdmin):
    list_display = ('request', 'predicted_flow', 'flow_type', 'accuracy', 'processed_at')
    list_filter = ('flow_type', 'processed_at')
