
    const exerciseForm = document.getElementById("exercise_form");

    exerciseForm.addEventListener("submit", () => {
      const userId = document.getElementById("uid").value.trim();
      document.getElementById("desc").value = document.getElementById("desc").value.trim();
      exerciseForm.action = `/api/users/${userId}/exercises`;
      if (document.getElementById("date").value === '') {
          document.getElementById("date").value = new Date().toISOString().substring(0, 10);
          console.log(document.getElementById("date").value);
      }

      exerciseForm.submit();
    });