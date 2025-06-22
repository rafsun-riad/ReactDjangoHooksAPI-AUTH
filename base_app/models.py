from django.contrib.auth.models import AbstractUser
from django.db import models
import time
import random

# Create your models here.


def generate_unique_id():
    return int(time.time() * 1) + random.randint(0, 999)


class User(AbstractUser):
    id = models.BigIntegerField(
        primary_key=True, default=generate_unique_id, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name + ' (' + self.email + ')'

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.first_name + ' ' + self.last_name
        super().save(*args, **kwargs)


class Category(models.Model):
    id = models.BigIntegerField(
        primary_key=True, default=generate_unique_id, editable=False)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    id = models.BigIntegerField(
        primary_key=True, default=generate_unique_id, editable=False)
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='blog_posts', null=True, blank=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='blog_posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
