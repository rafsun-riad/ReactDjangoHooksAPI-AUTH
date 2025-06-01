from django.db import models
import time
import random

# Create your models here.

def generate_unique_id():
  return int(time.time() * 1) + random.randint(0, 999)

class Category(models.Model):
    id = models.BigIntegerField(primary_key=True, default=generate_unique_id, editable=False)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class BlogPost(models.Model):
    id = models.BigIntegerField(primary_key=True, default=generate_unique_id, editable=False)
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='blog_posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title