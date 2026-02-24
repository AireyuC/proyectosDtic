from rest_framework import viewsets, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from apps.massive_messaging.models import MockFaculty, MockCareer, MockStudent, BroadcastMessage
from apps.massive_messaging.api.serializers import (
    MockFacultySerializer, 
    MockCareerSerializer, 
    MockStudentSerializer,
    SendMessageRequestSerializer
)
from apps.massive_messaging.tasks import dispatch_massive_message_task

class MockFacultyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List and retrieve faculties.
    """
    queryset = MockFaculty.objects.all()
    serializer_class = MockFacultySerializer
    permission_classes = [IsAuthenticated]

class MockCareerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List and retrieve careers. Can filter by faculty ID.
    Example: /api/massive-messaging/careers/?faculty=1
    """
    serializer_class = MockCareerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MockCareer.objects.all()
        faculty_id = self.request.query_params.get('faculty')
        if faculty_id:
            queryset = queryset.filter(faculty_id=faculty_id)
        return queryset

class MockStudentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List and retrieve students. Can filter by career ID.
    Example: /api/massive-messaging/students/?career=1
    """
    serializer_class = MockStudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MockStudent.objects.all()
        career_id = self.request.query_params.get('career')
        if career_id:
            queryset = queryset.filter(career_id=career_id)
        return queryset

class SendMassiveMessageView(views.APIView):
    """
    Endpoint protected for Admin/Superuser to dispatch massive messages.
    """
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        serializer = SendMessageRequestSerializer(data=request.data)
        if serializer.is_valid():
            target_type = serializer.validated_data['target_type']
            target_ids = serializer.validated_data.get('target_ids', [])
            message = serializer.validated_data['message']
            
            # Create the broadcast log in pending state
            target_summary = f"Type: {target_type}, IDs: {target_ids}"
            broadcast = BroadcastMessage.objects.create(
                message_content=message,
                sender=request.user,
                target_summary=target_summary,
                status='pending'
            )
            
            # Dispatch the async Celery task
            dispatch_massive_message_task.delay(
                broadcast_id=broadcast.id,
                target_type=target_type,
                target_ids=target_ids,
                message=message
            )
            
            return Response(
                {"detail": "Massive messaging task has been enqueued successfully.", "broadcast_id": broadcast.id},
                status=status.HTTP_202_ACCEPTED
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
