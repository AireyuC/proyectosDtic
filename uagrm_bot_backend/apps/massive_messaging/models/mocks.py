from django.db import models

class MockFaculty(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"
        
class MockCareer(models.Model):
    faculty = models.ForeignKey(MockFaculty, on_delete=models.CASCADE, related_name='careers')
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class MockStudent(models.Model):
    career = models.ForeignKey(MockCareer, on_delete=models.CASCADE, related_name='students')
    full_name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.registration_number} - {self.full_name}"
