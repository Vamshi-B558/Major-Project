from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('organizer-helper/', views.organizer_helper, name='organizer_helper'),
    path('dashboard/organizer/', views.organizer_dashboard, name='organizer_dashboard'),
    path('dashboard/user/', views.user_dashboard, name='user_dashboard'),
    path('results/', views.results_view, name='results'),
    path('export/csv/', views.export_csv, name='export_csv'),
    path('api/analytics/', views.analytics_data, name='analytics_data'),
]
