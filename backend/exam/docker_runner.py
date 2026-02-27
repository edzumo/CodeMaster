def run_code(language, code, timeout):
    import subprocess
    import tempfile
    import shutil
    from pathlib import Path

    IMAGE_MAP = {
        "python": "cgp-python-runner",
        "cpp": "cgp-cpp-runner",
        "c": "cgp-c-runner",
        "java": "cgp-java-runner",
        "javascript": "cgp-javascript-runner",
    }

    FILE_MAP = {
        "python": "code.py",
        "cpp": "code.cpp",
        "c": "code.c",
        "java": "Main.java",
        "javascript": "code.js",
    }

    if language not in IMAGE_MAP:
        return {"error": "Unsupported language"}

    temp_dir = tempfile.mkdtemp()

    try:
        file_name = FILE_MAP[language]
        image = IMAGE_MAP[language]
        file_path = Path(temp_dir) / file_name

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)

        cmd = [
            "docker", "run", "--rm",
            "--memory=256m",
            "--cpus=0.5",
            "-v", f"{temp_dir}:/app",
            image
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout + 2
        )

        if result.returncode != 0:
            return {
                "error": result.stderr.strip() or "Execution Error"
            }

        return {
            "output": result.stdout.strip()
        }

    except subprocess.TimeoutExpired:
        return {"error": "Time Limit Exceeded"}

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)