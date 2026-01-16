const dialog = document.querySelector<HTMLDialogElement>("dialog");
const countdownDisplay = document.getElementById("countdown") as HTMLElement;

let loginTimeoutId: ReturnType<typeof setInterval> | null = null;
let countdownIntervalId: ReturnType<typeof setInterval> | null = null;
const initialCountdownSeconds = 60;

export function clearSessionTimers() {
  if (loginTimeoutId !== null) {
    clearTimeout(loginTimeoutId);
    loginTimeoutId = null;
  }
  if (countdownIntervalId !== null) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }

  if (dialog?.open) {
    dialog.close();
    dialog.style.display = "none";
  }
  if (countdownDisplay) {
    countdownDisplay.innerHTML = initialCountdownSeconds.toString();
  }
}

function startCountdown(seconds: number) {
  if (countdownIntervalId !== null) {
    clearInterval(countdownIntervalId);
  }

  let counter: number = seconds;
  countdownDisplay.innerHTML = counter.toString();

  countdownIntervalId = setInterval(() => {
    counter--;
    countdownDisplay.innerHTML = counter.toString();

    if (counter <= 0) {
      clearInterval(countdownIntervalId!);
      countdownIntervalId = null;
    }
  }, 1000);
}

export function sessionTimer() {
  if (!dialog) {
    console.error("Dialog element not found");
    return;
  }
  clearSessionTimers();
  // TODO: fix to 60 from 15
  const sessionDurationSeconds = 60 * 1.2;
  const warningBeforeExpirySeconds = initialCountdownSeconds;
  const showWarningTimeoutMs =
    (sessionDurationSeconds - warningBeforeExpirySeconds) * 1000;
  const finalLogoutTimeoutMs = warningBeforeExpirySeconds * 1000;

  const warningTimerId = setTimeout(() => {
    countdownDisplay.innerHTML = initialCountdownSeconds.toString();
    dialog.style.display = "flex";
    dialog.showModal();
    startCountdown(initialCountdownSeconds);

    loginTimeoutId = setTimeout(() => {
      clearSessionTimers();
      dialog.style.display = "none";
      dialog.close();
      alert("Your session has expired. Please log in again.");
      if ((window as any).navigateWithFade) {
        (window as any).navigateWithFade("/");
      } else {
        window.location.href = "/";
      }
    }, finalLogoutTimeoutMs);
  }, showWarningTimeoutMs);
}
