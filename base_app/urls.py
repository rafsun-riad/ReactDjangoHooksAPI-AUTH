
from django.urls import path
from .views import *

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(),
         name='category-list-create'),
    path('categories/<int:id>/', CategoryDetailView.as_view(),
         name='category-detail'),
    path('blogs/', BlogPostListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:id>/', BlogPostDetailView.as_view(), name='blog-detail'),
]  # Define your URL patterns here
