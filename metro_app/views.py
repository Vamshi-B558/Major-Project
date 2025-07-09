from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q, Avg, Count
import json
import csv
from .models import CustomUser, MetroStation, PredictionRequest, PredictionResult
from .forms import CustomUserCreationForm, PredictionForm

def home(request):
    return render(request, 'metro_app/home.html')

def organizer_helper(request):
    """Helper page for creating organizer credentials"""
    return render(request, 'metro_app/organizer_helper.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user_type = request.POST['user_type']
        
        user = authenticate(request, username=username, password=password)
        if user is not None and user.user_type == user_type:
            login(request, user)
            if user_type == 'organizer':
                return redirect('organizer_dashboard')
            else:
                return redirect('user_dashboard')
        else:
            messages.error(request, 'Invalid credentials or user type')
    
    return render(request, 'metro_app/login.html')

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Registration successful!')
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'metro_app/register.html', {'form': form})

@login_required
def organizer_dashboard(request):
    if request.user.user_type != 'organizer':
        return redirect('user_dashboard')
    
    # Get statistics
    total_predictions = PredictionResult.objects.count()
    avg_accuracy = PredictionResult.objects.aggregate(Avg('accuracy'))['accuracy__avg'] or 0
    active_users = CustomUser.objects.filter(user_type='cloud_user').count()
    
    # Get recent predictions for charts
    recent_results = PredictionResult.objects.select_related('request').order_by('-processed_at')[:10]
    
    context = {
        'total_predictions': total_predictions,
        'avg_accuracy': round(avg_accuracy, 1),
        'active_users': active_users,
        'recent_results': recent_results,
    }
    
    return render(request, 'metro_app/organizer_dashboard.html', context)

@login_required
def user_dashboard(request):
    if request.user.user_type != 'cloud_user':
        return redirect('organizer_dashboard')
    
    if request.method == 'POST':
        form = PredictionForm(request.POST)
        if form.is_valid():
            prediction_request = form.save(commit=False)
            prediction_request.user = request.user
            prediction_request.save()
            
            # Simulate AFFN prediction (replace with actual model)
            import random
            predicted_flow = random.randint(1000, 5000)
            flow_type = 'High' if predicted_flow > 3500 else 'Medium' if predicted_flow > 2000 else 'Low'
            accuracy = random.uniform(85, 98)
            
            PredictionResult.objects.create(
                request=prediction_request,
                predicted_flow=predicted_flow,
                flow_type=flow_type,
                accuracy=accuracy
            )
            
            messages.success(request, 'Prediction completed successfully!')
            return redirect('results')
    else:
        form = PredictionForm()
    
    # Get user's recent predictions
    user_predictions = PredictionResult.objects.filter(
        request__user=request.user
    ).order_by('-processed_at')[:5]
    
    context = {
        'form': form,
        'user_predictions': user_predictions,
    }
    
    return render(request, 'metro_app/user_dashboard.html', context)

@login_required
def results_view(request):
    # Get filter parameters
    date_filter = request.GET.get('date', '')
    station_filter = request.GET.get('station', '')
    flow_type_filter = request.GET.get('flow_type', '')
    search_query = request.GET.get('search', '')
    
    # Base queryset
    if request.user.user_type == 'organizer':
        results = PredictionResult.objects.all()
    else:
        results = PredictionResult.objects.filter(request__user=request.user)
    
    # Apply filters
    if date_filter:
        results = results.filter(request__date=date_filter)
    if station_filter:
        results = results.filter(
            Q(request__source_station__name__icontains=station_filter) |
            Q(request__destination_station__name__icontains=station_filter)
        )
    if flow_type_filter:
        results = results.filter(flow_type=flow_type_filter)
    if search_query:
        results = results.filter(
            Q(request__fid__icontains=search_query) |
            Q(request__trip_id__icontains=search_query) |
            Q(request__source_station__name__icontains=search_query) |
            Q(request__destination_station__name__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(results.order_by('-processed_at'), 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Statistics
    total_results = results.count()
    avg_accuracy = results.aggregate(Avg('accuracy'))['accuracy__avg'] or 0
    avg_flow = results.aggregate(Avg('predicted_flow'))['predicted_flow__avg'] or 0
    high_flow_count = results.filter(flow_type='High').count()
    
    context = {
        'page_obj': page_obj,
        'total_results': total_results,
        'avg_accuracy': round(avg_accuracy, 1),
        'avg_flow': round(avg_flow),
        'high_flow_count': high_flow_count,
        'date_filter': date_filter,
        'station_filter': station_filter,
        'flow_type_filter': flow_type_filter,
        'search_query': search_query,
    }
    
    return render(request, 'metro_app/results.html', context)

@login_required
def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="predictions.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['ID', 'Date', 'Time', 'Source', 'Destination', 'Predicted Flow', 'Flow Type', 'Accuracy'])
    
    if request.user.user_type == 'organizer':
        results = PredictionResult.objects.all()
    else:
        results = PredictionResult.objects.filter(request__user=request.user)
    
    for result in results:
        writer.writerow([
            result.request.fid,
            result.request.date,
            result.request.time,
            result.request.source_station.name,
            result.request.destination_station.name,
            result.predicted_flow,
            result.flow_type,
            f"{result.accuracy:.1f}%"
        ])
    
    return response

@login_required
def analytics_data(request):
    """API endpoint for chart data"""
    if request.user.user_type == 'organizer':
        results = PredictionResult.objects.all()
    else:
        results = PredictionResult.objects.filter(request__user=request.user)
    
    # Flow distribution data
    flow_distribution = results.values('flow_type').annotate(count=Count('flow_type'))
    
    # Station-wise data
    station_data = results.values(
        'request__source_station__name'
    ).annotate(
        avg_flow=Avg('predicted_flow')
    ).order_by('-avg_flow')[:5]
    
    data = {
        'flow_distribution': list(flow_distribution),
        'station_data': list(station_data),
    }
    
    return JsonResponse(data)

def logout_view(request):
    logout(request)
    return redirect('login')
