import uuid
from django.db import models


class UserSession(models.Model):
    username = models.CharField(max_length=100)
    session_id = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, default="Easy")
    time_limit = models.IntegerField(default=2)
    hidden_tests = models.JSONField()
    sample_tests = models.JSONField(null=True, blank=True)
    function_templates = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Submission(models.Model):
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    language = models.CharField(max_length=20)
    code = models.TextField()
    score = models.IntegerField()
    status = models.CharField(max_length=20)
    execution_time = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.session.username} - {self.question.title}"
    
class QuestionSession(models.Model):
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)

