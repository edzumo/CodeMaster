def wrap_code(language, user_code, test_input):
    """
    Wrap user code into executable program per language.
    Assumes test_input is already formatted properly.
    """

    if language == "python":
        return f"""
{user_code}

print(solution({test_input}))
"""

    elif language == "cpp":
        return f"""
#include <bits/stdc++.h>
using namespace std;

{user_code}

int main() {{
    cout << solution({test_input});
    return 0;
}}
"""

    elif language == "c":
        return f"""
#include <stdio.h>

{user_code}

int main() {{
    printf("%d", solution({test_input}));
    return 0;
}}
"""

    elif language == "java":
        return f"""
public class Main {{

{user_code}

    public static void main(String[] args) {{
        System.out.println(solution({test_input}));
    }}
}}
"""

    elif language == "javascript":
        return f"""
{user_code}

console.log(solution({test_input}));
"""

    else:
        return "Unsupported language"