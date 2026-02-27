from rest_framework import serializers
from .models import Question, Submission, UserSession


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'


class UserSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = '__all__'