
from django.contrib import admin
from .models import Auser

@admin.register(Auser)
class UserAdmin(admin.ModelAdmin):
    pass

