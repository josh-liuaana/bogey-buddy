// Assign colors for different sources
const sourceColors: Record<string, string> = {
  AuthGate: "#3b82f6", // blue
  PrivateRoute: "#10b981", // green
  PublicRoute: "#facc15", // yellow
  AuthProvider: "#8b5cf6", // purple
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
      data
    );
  } else {
    console.log(
      `${prefix} %c${timestamp} - ${message}`,
      prefixStyle,
      messageStyle
    );
  }
}
