from django.shortcuts import render
from django.http import JsonResponse,HttpResponseRedirect
from .models import Auser
from django.urls import reverse
from django.contrib.auth.models import User
#from django.core.mail import send_mail

"""send_mail(
    'Subject here',
    'Here is the message.',
    'from@example.com',
    ['to@example.com'],
    fail_silently=False,
)"""

import json
# Create your views here.


def index(request):
    user_id = request.session.get("user_id")
    print(user_id)
    if not user_id:
        return HttpResponseRedirect(reverse("login-page"))
    user = User.objects.get(pk=user_id)
    return render(request, "index.html",{"user":user,"is_user":True})

def logout(request):
    request.session.flush()
    return HttpResponseRedirect(reverse('login-page'))

def login_page(request):
    return render(request, "login.html")


def signup_page(request):
    return render(request, "signup.html")


def is_username_exist(username):
    return User.objects.filter(username=username).exists()

def is_email_exist(email):
    return User.objects.filter(email=email).exists()


def signup(request):
    if request.method == 'POST':
        if request.is_ajax():
            data = json.load(request)
            if data["active_group"] == 0:
                username = data['username']
                if is_username_exist(username):
                    return JsonResponse(
                        {"status": False, "error": "username already exist", "type": 'username'})
                return JsonResponse({"status": True})
            elif data["active_group"] == 1:
                firstname = data["firstname"]
                lastname = data["lastname"]
                username = data["username"]
                password = data["password"]
                email = data["email"]

                if is_email_exist(email):
                    return JsonResponse(
                        {"status": False, "error": "email already exist", "type": 'email'})
                u1 = User.objects.create_user(username,email,password)
                u1.save()
                u1.firstname = firstname
                u1.lastname = lastname

                p1 = Auser(user=u1,is_authenticated=False)
                p1.save()

                return JsonResponse({"status":True,"type":"sucess"})

            else:
                return JsonResponse(
                    {"status": False,"type":'injection'})
        else:
            return JsonResponse({"status": False})
    else:
        return JsonResponse({"status": False})

def login(request):
    if request.method == 'POST':
        if request.is_ajax():
            data = json.load(request)
            username_email = data['username_email']
            password = data['password']
            if is_email_exist(username_email):
                user = User.objects.get(email=username_email)
                print(user.check_password(password))
            elif is_username_exist(username_email):
                user = User.objects.get(username=username_email)
            else:
                return JsonResponse({"status":False,"type":"username"})

            if user.check_password(password):
                request.session['user_id'] = user.id
                return JsonResponse({"status":True})
            else:
                return JsonResponse({"status":False,"type":"password"})


