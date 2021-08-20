from django.contrib.auth.models import User
from django.db import models


class Auser(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_authenticated = models.BooleanField()

    def __str__(self):
        auth = "✔️" if self.is_authenticated else "⚠️"
        return f"{self.user.username}:{auth}"

