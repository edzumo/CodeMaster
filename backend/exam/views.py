from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import QuestionSerializer
from .wrapper import wrap_code
from .docker_runner import run_code
from .models import Question, Submission, UserSession
from django.db.models import Avg, Count
from django.utils import timezone
from datetime import timedelta

@api_view(['GET'])
def performance_metrics(request):
    session_id = request.GET.get("session_id")

    if not session_id:
        return Response({"error": "Session required"}, status=400)

    submissions = Submission.objects.filter(session__session_id=session_id)

    total = submissions.count()
    passed = submissions.filter(status="pass").count()
    avg_score = submissions.aggregate(avg=Avg("score"))["avg"] or 0

    last_7_days = timezone.now() - timedelta(days=7)
    weekly = (
        submissions.filter(created_at__gte=last_7_days)
        .values("created_at__date")
        .annotate(count=Count("id"))
        .order_by("created_at__date")
    )

    return Response({
        "total_submissions": total,
        "passed": passed,
        "avg_score": avg_score,
        "weekly_activity": list(weekly)
    })

# -------------------------
# Silent Login
# -------------------------



@api_view(['POST'])
def login(request):
    username = request.data.get("username")

    if not username:
        return Response({"error": "Username required"}, status=400)

    session = UserSession.objects.create(username=username)

    return Response({
        "username": session.username,
        "session_id": str(session.session_id)
    })
# -------------------------
# Admin Question CRUD
# -------------------------

@api_view(['GET'])
def get_questions(request):
    questions = Question.objects.all()
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_question(request):
    serializer = QuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": True})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_question(request, pk):
    try:
        question = Question.objects.get(pk=pk)
        question.delete()
        return Response({"success": True})
    except Question.DoesNotExist:
        return Response(status=404)
    
@api_view(['POST'])
def submit(request):

    # -------------------------
    # Validate Session
    # -------------------------
    session_id = request.data.get("session_id")

    try:
        session = UserSession.objects.get(session_id=session_id)
    except UserSession.DoesNotExist:
        return Response({"error": "Invalid session"}, status=400)

    question_id = request.data.get("questionId")
    language = request.data.get("language")
    code = request.data.get("code")

    if not question_id or not language or not code:
        return Response({"error": "Missing fields"}, status=400)

    # -------------------------
    # Validate Question
    # -------------------------
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return Response({"error": "Invalid question"}, status=400)

    tests = question.hidden_tests

    if not tests:
        return Response({"error": "No test cases configured"}, status=400)

    # -------------------------
    # Execute Per Test
    # -------------------------
    detailed_results = []
    passed = 0

    for test in tests:
        wrapped = wrap_code(language, code, test["input"])
        execution = run_code(language, wrapped, question.time_limit)

        if "error" in execution:
            return Response({
                "error": execution["error"]
            })

        output = execution["output"]
        expected = str(test["output"]).strip()
        actual = output.strip()

        status_case = "pass" if actual == expected else "fail"

        if status_case == "pass":
            passed += 1

        detailed_results.append({
            "input": str(test["input"]),
            "expected": expected,
            "output": actual,
            "status": status_case
        })

    score = int((passed / len(tests)) * 100)
    status_val = "pass" if score == 100 else "fail"     

    # -------------------------
    # Save Submission
    # -------------------------
    Submission.objects.create(
        session=session,
        question=question,
        language=language,
        code=code,
        score=score,
        status=status_val,
        execution_time=0
    )

    return Response({
        "score": score,
        "passed": passed,
        "total": len(tests),
        "status": status_val,
        "details": detailed_results
    })

@api_view(['GET'])
def leaderboard(request):
    top = Submission.objects.order_by('-score', 'created_at')[:50]

    data = [
        {
            "username": s.session.username,
            "score": s.score,
            "language": s.language,
            "question": s.question.title,
            "time": s.created_at
        }
        for s in top
    ]

    return Response(data)

@api_view(['GET'])
def submission_history(request):

    session_id = request.query_params.get("session_id")

    if not session_id:
        return Response({"error": "session_id required"}, status=400)

    try:
        session = UserSession.objects.get(session_id=session_id)
    except UserSession.DoesNotExist:
        return Response({"error": "Invalid session"}, status=400)

    submissions = Submission.objects.filter(session=session).order_by('-created_at')

    data = [
        {
            "question": s.question.title,
            "score": s.score,
            "status": s.status,
            "language": s.language,
            "created_at": s.created_at
        }
        for s in submissions
    ]

    return Response(data)