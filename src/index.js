const fs = require("fs");
const readline = require("readline");

// Global variables to store session data and timestamps
let sessions = {};
let lastTimestamp = null;
let earliestTimestamp = null;

// Function to validate HH:MM:SS (00-23 for hours, 00-59 for minutes and seconds), username, and Start/End event
function isValidLine(line) {
  return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)\s\w+\s(Start|End)$/.test(line);
}

// Function to calculate duration in seconds between two timestamps
function calculateDuration(start, end) {
  const [startHours, startMinutes, startSeconds] = start.split(":").map(Number);
  const [endHours, endMinutes, endSeconds] = end.split(":").map(Number);

  const startDate = new Date(0, 0, 0, startHours, startMinutes, startSeconds);
  const endDate = new Date(0, 0, 0, endHours, endMinutes, endSeconds);

  return (endDate - startDate) / 1000; // Convert duration to seconds
}

// Processes each line of the log file
function processLine(line) {
  if (!isValidLine(line)) return; // Skip invalid lines

  const [timestamp, username, event] = line.split(" ");

  // Update earliest timestamp if necessary
  if (!earliestTimestamp || timestamp < earliestTimestamp) {
    earliestTimestamp = timestamp;
  }

  // Initialize user session data if not already present
  if (!sessions[username]) {
    sessions[username] = { totalDuration: 0, lastStart: null, sessionCount: 0 };
  }

  // Handle 'Start' event
  if (event === "Start") {
    // Start a new session only if there isn't one already in progress (to handle overlapping sessions)
    if (!sessions[username].lastStart) {
      sessions[username].lastStart = timestamp;
      sessions[username].sessionCount++;
    }
    // If a session is already in progress, it continues without incrementing the session count
  } else if (event === "End") {
    // Handle 'End' event
    if (!sessions[username].lastStart) {
      // If there's no ongoing session, assume it started at the earliest timestamp
      sessions[username].lastStart = earliestTimestamp;
      sessions[username].sessionCount++;
    }
    // Calculate the session duration and update total duration
    const duration = calculateDuration(sessions[username].lastStart, timestamp);
    sessions[username].totalDuration += duration;
    sessions[username].lastStart = null; // End the current session
  }

  // Update the last timestamp processed
  lastTimestamp = timestamp;
}

// Generates and prints the session report to the console
function generateReport() {
  for (const [username, data] of Object.entries(sessions)) {
    const reportLine = `${username} ${data.sessionCount} ${data.totalDuration}`;
    console.log(reportLine);
  }
}

// Handles any open sessions at the end of the file
function handleOpenSessions() {
  for (const [username, data] of Object.entries(sessions)) {
    if (data.lastStart) {
      // Open sessions end at the last log entry time
      const duration = calculateDuration(data.lastStart, lastTimestamp);
      sessions[username].totalDuration += duration;
      sessions[username].lastStart = null;
    }
  }
}

// Main function to process the log file
function processLogFile(filePath) {
  // Check if the file exists before attempting to read
  if (!fs.existsSync(filePath)) {
    console.error("File does not exist");
    return;
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false,
  });

  // Read the file line by line
  rl.on("line", (line) => {
    processLine(line);
  });

  // Once file reading is complete, handle any open sessions and generate the report
  rl.on("close", () => {
    handleOpenSessions();
    generateReport();
  });
}

// Extract file path from command-line arguments and process the file
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Please provide a file path");
  } else {
    processLogFile(filePath);
  }
}

// Export methods for testing with Jest
module.exports = { isValidLine, calculateDuration };
