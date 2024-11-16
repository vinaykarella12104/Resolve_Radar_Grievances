from django.shortcuts import render, redirect,reverse
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .forms import RegisterForm,UserProfileForm, ProfileForm,ComplaintForm,LoginForm
from .forms import CustomPasswordResetForm
from .models import Profile, Complaint
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password

def index(request):
    return render(request, 'complaints/index.html')

def about(request):
    return render(request, 'complaints/about.html')

def custom_login(request):
    return render(request, 'complaints/login.html')

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            # Set a success message
            messages.success(request, 'Registration successful! You can now log in.')
            return redirect('student_login')  # Redirect to login page after registration
    else:
        form = RegisterForm()

    return render(request, 'complaints/register.html', {'form': form})

def student_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('dashboard') # Redirect to the dashboard without passing profile_id
            else:
                messages.error(request, 'Invalid username or password.')
                return redirect('student_login')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = LoginForm()

    return render(request, 'complaints/student_login.html', {'form': form})

@login_required
def dashboard(request):
    profile = request.user.profile  # Assuming a one-to-one relationship with User
    
    total_complaints = Complaint.objects.filter(user=request.user).count()
    in_progress_complaints = Complaint.objects.filter(user=request.user, status='In progress').count()
    resolved_complaints = Complaint.objects.filter(user=request.user, status='Resolved').count()

    context = {
        'profile': profile,
        'total_complaints': total_complaints,
        'in_progress_complaints': in_progress_complaints,
        'resolved_complaints': resolved_complaints,
    }
    return render(request, 'complaints/dashboard2.html', context)

@login_required
def lodge_complaint(request):
    if request.method == 'POST':
        form = ComplaintForm(request.POST, request.FILES)  # Handle file uploads
        if form.is_valid():
            complaint = form.save(commit=False)
            complaint.user = request.user
            complaint.save()
            messages.success(request, 'Complaint submitted successfully!')
            return redirect('dashboard')
        else:
            messages.error(request, 'Failed to lodge the complaint. Please check the form and try again.')
            return redirect('lodge_complaint')
    else:
        form = ComplaintForm()
    return render(request, 'complaints/lodge_complaint2.html', {'form': form})

@login_required
def complaint_history(request):
    complaints = Complaint.objects.filter(user=request.user)

    # Get filter parameters from the URL
    status_filter = request.GET.get('status')

    # Apply filters if they exist
    if status_filter:
        complaints = complaints.filter(status=status_filter)

    context = {
        'complaints': complaints,
        'status_choices': Complaint.STATUS_CHOICES,  # Pass choices to template
        'status_filter': status_filter,
    }
    return render(request, 'complaints/complaint_history2.html', context)



def profile(request):
    if request.method == 'POST':
        user_form = UserProfileForm(request.POST, instance=request.user)
        profile_form = ProfileForm(request.POST, instance=request.user.profile)
        
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            return redirect('profile')  # Adjust the redirect if needed
    else:
        user_form = UserProfileForm(instance=request.user)
        profile_form = ProfileForm(instance=request.user.profile)
    
    return render(request, 'complaints/profile2.html', {
        'user_form': user_form,
        'profile_form': profile_form
    })

def password_reset_form(request):
    return render(request, 'complaints/password_reset_form.html')

@login_required
def password_reset(request):
    if request.method == 'POST':
        current_password = request.POST.get('current_password')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')

        user = request.user

        if not check_password(current_password, user.password):
            messages.error(request, 'Current password is incorrect.')
        elif new_password != confirm_password:
            messages.error(request, 'New passwords do not match.')
        elif not is_password_complex(new_password):
            messages.error(request, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
        else:
            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Password reset successful!')
            return redirect('password_reset')

    return render(request, 'complaints/password_reset2.html')

def is_password_complex(password):
    if len(password) < 8:
        return False
    has_upper = any(char.isupper() for char in password)
    has_lower = any(char.islower() for char in password)
    has_digit = any(char.isdigit() for char in password)
    has_special = any(char in '!@#$%^&*()-_=+[]{}|;:,.<>?/' for char in password)
    return has_upper and has_lower and has_digit and has_special


def reset_password(request):
    return render(request, 'complaints/reset_password.html')


def logout(request):
    return render(request, 'complaints/logout.html')













