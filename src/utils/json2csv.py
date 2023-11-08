import csv
import json
import sys

from classes import classes  # Import the JSON data from the module


# # Check for the correct number of command-line arguments
# if len(sys.argv) != 3:
#     print("Usage: python script.py input.json output.csv")
#     sys.exit(1)

# # Get the input and output file paths from command-line arguments
# input_file_path = sys.argv[1]
# output_file_path = sys.argv[2]

# try:
#     # Open the input JSON file for reading and the output CSV file for writing
#     with open(input_file_path, 'r') as json_file, open(output_file_path, 'w', newline='') as csv_file:
#         # Create a CSV writer
#         csv_writer = csv.writer(csv_file)

#         # Iterate through each line in the JSON file
#         for line in json_file:
#             # Load the JSON data from the current line
#             data = json.loads(line)

#             # Write the JSON data as a row in the CSV file
#             csv_writer.writerow(data)

#     print("Conversion from JSON to CSV complete.")
# except FileNotFoundError:
#     print("One or both of the specified files does not exist.")
# except Exception as e:
#     print(f"An error occurred: {str(e)}")

# Create a CSV string in memory
csv_string = ""

# Create a CSV writer
csv_writer = csv.writer(csv_string.splitlines())  # Use splitlines to simulate a file-like object

# Write the CSV header
header = ["id", "name", "age"]
csv_writer.writerow(header)

# Write JSON data as CSV rows
for item in json_data:
    row = [item["id"], item["name"], item["age"]]
    csv_writer.writerow(row)

# Now, 'csv_string' contains the CSV data
print(csv_string)