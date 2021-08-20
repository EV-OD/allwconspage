
from django.urls import path

from .views import index,login_page,signup_page,signup,login,logout

urlpatterns = [
    path("",index, name="index-page"),
    path("login",login_page, name="login-page"),
    path("signup",signup_page, name="signup-page"),
    path("user",signup),
    path("user_login",login),
    path("logout",logout,name="logout")
]
