from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login),
    path('questions/', views.get_questions),
    path('add-question/', views.add_question),
    path('delete-question/<uuid:pk>/', views.delete_question),
    path('submit/', views.submit),
    path('leaderboard/', views.leaderboard),
    path('history/', views.submission_history),
    path("metrics/", views.performance_metrics),
]