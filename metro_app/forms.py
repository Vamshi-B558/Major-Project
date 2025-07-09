from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser, PredictionRequest, MetroStation

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    mobile = forms.CharField(max_length=15, required=False)
    address = forms.CharField(widget=forms.Textarea, required=False)
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    gender = forms.ChoiceField(choices=[('', 'Select Gender'), ('male', 'Male'), ('female', 'Female'), ('other', 'Other')], required=False)
    pin_code = forms.CharField(max_length=10, required=False)
    profile_picture = forms.ImageField(required=False)
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2', 'mobile', 'address', 
                 'date_of_birth', 'gender', 'pin_code', 'profile_picture')
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.user_type = 'cloud_user'
        if commit:
            user.save()
        return user

class PredictionForm(forms.ModelForm):
    source_station = forms.ModelChoiceField(
        queryset=MetroStation.objects.all(),
        empty_label="Select Source Station"
    )
    destination_station = forms.ModelChoiceField(
        queryset=MetroStation.objects.all(),
        empty_label="Select Destination Station"
    )
    
    class Meta:
        model = PredictionRequest
        fields = ['fid', 'trip_id', 'metro_name', 'city', 'source_station', 
                 'destination_station', 'date', 'time', 'number_of_boardings']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'time': forms.TimeInput(attrs={'type': 'time'}),
        }
