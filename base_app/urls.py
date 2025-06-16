
from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', register, name='register_person'),
    path('auth/login/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('auth/validate-token/',
         TokenValidationView.as_view(), name='validate_token'),
    path('categories/', CategoryListCreateView.as_view(),
         name='category-list-create'),
    path('categories/<int:id>/', CategoryDetailView.as_view(),
         name='category-detail'),
    path('blogs/', BlogPostListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:id>/', BlogPostDetailView.as_view(), name='blog-detail'),
]  # Define your URL patterns here
