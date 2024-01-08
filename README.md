# Fair Billing Task

## Overview

Fair Billing is a command-line JavaScript application that processes a log file from a hosted application provider. It calculates the total duration and number of sessions for each user based on start and end times recorded in the log. The application is designed to handle various edge cases, such as overlapping sessions and sessions that may not have explicit start or end events.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install all dependencies.

## Running the Application

To execute the script, use the following command:

```bash
node src/index.js [path-to-log-file]
```

## Features

- Robust parsing of log files for session data, even with invalid lines.
- Accurate calculation of total session duration and count per user.
- Handles overlapping sessions by merging them into a single session for minimal total duration calculation.
- Assumes the earliest timestamp in the log as the start time for sessions that only have an end event, and the last timestamp for sessions that only have a start event.
- Outputs a summary report to the console.

## Assumptions and Limitations

The following assumptions were made due to the ambiguity in the log file format and instructions:

- All records in the log file are assumed to be from within a single day, i.e., they do not span past midnight.
- If a session 'End' record is encountered without a corresponding 'Start', it is assumed that the session began at the earliest time found in the log.
- Whereas, if a session 'Start' record has no corresponding 'End', the session is assumed to end at the last time recorded in the log.
- Overlapping sessions for the same user are merged into one session, under the assumption that this reflects the user's continuous activity and results in the shortest possible total duration.
- The application does not currently support multi-day log files.

## Testing

To run the included test suite, execute:

```bash
npm test
```

Tests are written using Jest and cover a variety of expected and edge-case scenarios to ensure the application's robustness.
