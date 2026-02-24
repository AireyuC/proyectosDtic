from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.massive_messaging.api.views import (
    MockFacultyViewSet, 
    MockCareerViewSet, 
    MockStudentViewSet,
    SendMassiveMessageView
)

router = DefaultRouter()
router.register(r'faculties', MockFacultyViewSet, basename='mock-faculty')
router.register(r'careers', MockCareerViewSet, basename='mock-career')
router.register(r'students', MockStudentViewSet, basename='mock-student')

urlpatterns = [
    path('', include(router.urls)),
    path('send/', SendMassiveMessageView.as_view(), name='send-massive-message'),
]
