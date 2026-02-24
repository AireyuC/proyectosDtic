from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class BroadcastMessage(models.Model):
    message_content = models.TextField()
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    target_summary = models.TextField(help_text="Summary of selected target audience criteria.")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, default='pending')
    
    def __str__(self):
        return f"Broadcast #{self.id} sent by {self.sender} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"
