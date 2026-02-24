from django.contrib import admin
from .models import MockFaculty, MockCareer, MockStudent, BroadcastMessage

@admin.register(MockFaculty)
class MockFacultyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ('code', 'name')

@admin.register(MockCareer)
class MockCareerAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'faculty')
    list_filter = ('faculty',)
    search_fields = ('code', 'name')

@admin.register(MockStudent)
class MockStudentAdmin(admin.ModelAdmin):
    list_display = ('registration_number', 'full_name', 'career', 'phone_number')
    list_filter = ('career__faculty', 'career')
    search_fields = ('registration_number', 'full_name', 'phone_number')

@admin.register(BroadcastMessage)
class BroadcastMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('message_content',)
