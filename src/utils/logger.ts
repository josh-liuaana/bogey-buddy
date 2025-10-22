// Assign colors for different sources
// Anything firebase related should be red
// Anything auth related should be white

const sourceColors: Record<string, string> = {
  Auth: "#ffffff", // white
  Firebase: "#ef4444", // red
  AuthGate: "#ffffff", // white
  PrivateRoute: "#10b981", // green
  PublicRoute: "#facc15", // yellow
  AuthProvider: "#ffffff", // purple
  RoundProvider: "#3b82f6", // blue
  CourseProvider: "#ef4444", // red
  Login: "#ffffff", // white
  localStorage: "#8b5cf6", // purple
  default: "#9ca3af", // gray
};

export function log(source: string, message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  const color = sourceColors[source] ?? sourceColors.default;

  const prefix = `%c[${source}]`;
  const prefixStyle = `color: ${color}; font-weight: bold`;
  const messageStyle = "color: #9ca3af"; // gray for timestamp/message

  if (data !== undefined) {
    console.log(
      `${prefix} %c${timestamp} - ${message}`,
      prefixStyle,
      messageStyle,
      data,
    );
  } else {
    console.log(
      `${prefix} %c${timestamp} - ${message}`,
      prefixStyle,
      messageStyle,
    );
  }
}
