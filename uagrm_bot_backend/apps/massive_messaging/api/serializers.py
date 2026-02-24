from rest_framework import serializers
from apps.massive_messaging.models import MockFaculty, MockCareer, MockStudent, BroadcastMessage

class MockFacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = MockFaculty
        fields = ['id', 'code', 'name']

class MockCareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockCareer
        fields = ['id', 'code', 'name', 'faculty']

class MockStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockStudent
        fields = ['id', 'registration_number', 'full_name', 'phone_number', 'career']

class BroadcastMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BroadcastMessage
        fields = ['id', 'message_content', 'target_summary', 'created_at', 'status']

class SendMessageRequestSerializer(serializers.Serializer):
    target_type = serializers.ChoiceField(choices=['all', 'faculty', 'career', 'student'])
    target_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        required=False,
        help_text="List of IDs depending on target_type. Example: List of career IDs if target_type is 'career'."
    )
    message = serializers.CharField(max_length=2000)
    
    def validate(self, data):
        target_type = data.get('target_type')
        target_ids = data.get('target_ids', [])
        
        if target_type != 'all' and not target_ids:
            raise serializers.ValidationError({"target_ids": "This field is required unless target_type is 'all'."})
            
        return data
