from celery import shared_task
import requests
import os
from django.conf import settings
from apps.massive_messaging.models import MockFaculty, MockCareer, MockStudent, BroadcastMessage

# Meta only allows one webhook, so we use the SAME n8n webhook for incoming and outgoing.
N8N_MAIN_WEBHOOK_URL = os.getenv('N8N_WEBHOOK_URL', 'http://n8n:5678/webhook/whatsapp')

@shared_task(bind=True)
def dispatch_massive_message_task(self, broadcast_id, target_type, target_ids, message):
    """
    Async Celery task to query affected students and send the payload to n8n webhook.
    """
    try:
        broadcast = BroadcastMessage.objects.get(id=broadcast_id)
        broadcast.status = 'processing'
        broadcast.save()
        
        # Get target students based on selection
        students = MockStudent.objects.none()
        
        if target_type == 'all':
            students = MockStudent.objects.all()
        elif target_type == 'faculty':
            students = MockStudent.objects.filter(career__faculty_id__in=target_ids)
        elif target_type == 'career':
            students = MockStudent.objects.filter(career_id__in=target_ids)
        elif target_type == 'student':
            students = MockStudent.objects.filter(id__in=target_ids)
            
        student_list = list(students.values('full_name', 'phone_number', 'registration_number'))
        
        if not student_list:
            broadcast.status = 'failed: no target students found'
            broadcast.save()
            return
            
        # Sanitize phone numbers for Meta API (remove '+' and spaces)
        prepared_students = []
        for s in student_list:
            clean_phone = s['phone_number'].replace('+', '').replace(' ', '')
            s['phone_number'] = clean_phone
            prepared_students.append(s)
            
        # Send payload to n8n Webhook
        payload = {
            "type": "massive_broadcast", # Important flag for n8n Switch node
            "broadcast_id": broadcast_id,
            "message": message,
            "students": prepared_students
        }
        
        # We wrap in try-except to handle n8n connection errors
        try:
            response = requests.post(N8N_MAIN_WEBHOOK_URL, json=payload, timeout=10)
            response.raise_for_status()
            broadcast.status = 'completed'
        except requests.exceptions.RequestException as req_err:
            broadcast.status = f'failed: n8n webhook error {req_err}'[:255]
            
        broadcast.save()
        
    except Exception as e:
        # Catch unexpected errors to avoid silent celery failures
        try:
            broadcast = BroadcastMessage.objects.get(id=broadcast_id)
            broadcast.status = f'failed: Exception - {str(e)}'[:255]
            broadcast.save()
        except BroadcastMessage.DoesNotExist:
            pass
        raise e
