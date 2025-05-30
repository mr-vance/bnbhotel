#!/bin/bash

# List of code-related file extensions to include
CODE_EXTENSIONS=(
  "*.vue" "*.ts" "*.scss" "*.php" "*.blade.php" "*.js"
)

# Initialize a dictionary for storing the output files (extension -> filename)
declare -A OUTPUT_FILES
declare -A FILE_COUNTERS
declare -A LINE_COUNTS

# Maximum lines per file (approximate, splits at file boundaries)
MAX_LINES=1000

# Function to process each file
process_file() {
  local file_path=$1
  local extension=$2
  local current_file="${OUTPUT_FILES[$extension]}"
  local counter="${FILE_COUNTERS[$extension]}"
  local line_count="${LINE_COUNTS[$extension]}"

  # Check if the file is text-based using 'file' command
  if file "$file_path" | grep -q "text"; then
    # Debugging: Print file being processed
    echo "Processing: $file_path"

    # Count lines in the file to be added
    local file_lines=$(wc -l < "$file_path")
    local header_lines=6  # For START, END, and spacing
    local total_new_lines=$((file_lines + header_lines))

    # Check if adding this file would exceed MAX_LINES
    if [ $line_count -gt 0 ] && [ $((line_count + total_new_lines)) -gt $MAX_LINES ]; then
      # Increment counter and create new output file
      counter=$((counter + 1))
      FILE_COUNTERS[$extension]=$counter
      current_file="projectCodeFiles${extension}_${counter}.txt"
      OUTPUT_FILES[$extension]="$current_file"
      LINE_COUNTS[$extension]=0  # Reset line count for the new file

      # Create new output file with header
      > "$current_file"
      echo "-------------" > "$current_file"
      echo "PROJECT CODE FILES ($extension) - Part $counter" >> "$current_file"
      echo "-------------" >> "$current_file"
      echo "" >> "$current_file"
    fi

    # Append the file content to the current output file
    echo "-------$file_path START--------" >> "$current_file"
    iconv -f UTF-8 -t UTF-8 -c "$file_path" >> "$current_file" 2>/dev/null || cat "$file_path" >> "$current_file"
    echo "" >> "$current_file"
    echo "-------$file_path END--------" >> "$current_file"
    echo "" >> "$current_file"

    # Update line count
    LINE_COUNTS[$extension]=$((line_count + total_new_lines))
  else
    echo "Skipping non-text file: $file_path"
  fi
}

# Export the function to be used with find
export -f process_file
export -A OUTPUT_FILES
export -A FILE_COUNTERS
export -A LINE_COUNTS

# Build the find command with multiple -name conditions and exclude directories
FIND_CMD="find . -type d \( -name \"node_modules\" -o -name \"vendor\" -o -name \"storage\" \) -prune -o -type f \( "
for ext in "${CODE_EXTENSIONS[@]}"; do
  FIND_CMD+=" -name \"$ext\" -o"
done
# Remove the trailing -o and close the parentheses
FIND_CMD="${FIND_CMD::-2} \)"

# Find all code files, excluding node_modules, vendor, and storage
echo "Finding all code files with specified extensions, excluding node_modules, vendor, and storage..."

# Create separate output files for each extension type
for ext in "${CODE_EXTENSIONS[@]}"; do
  # Get the file extension (e.g., .vue, .ts, .scss, .js)
  ext_name="${ext//\*/}"
  OUTPUT_FILES["$ext_name"]="projectCodeFiles${ext_name}_1.txt"
  FILE_COUNTERS["$ext_name"]=1
  LINE_COUNTS["$ext_name"]=0
  # Clear or create the first output file for the extension
  > "${OUTPUT_FILES[$ext_name]}"
  # Write header to the output file
  echo "-------------" > "${OUTPUT_FILES[$ext_name]}"
  echo "PROJECT CODE FILES ($ext_name) - Part 1" >> "${OUTPUT_FILES[$ext_name]}"
  echo "-------------" >> "${OUTPUT_FILES[$ext_name]}"
  echo "" >> "${OUTPUT_FILES[$ext_name]}"
done

# Execute the find command and process the files
eval "$FIND_CMD" | while read file; do
  # Determine the file extension
  for ext in "${CODE_EXTENSIONS[@]}"; do
    if [[ "$file" == $ext ]]; then
      ext_name="${ext//\*/}"
      process_file "$file" "$ext_name"
    fi
  done
done

# Notify the user
echo "Finished processing code files. All data saved to corresponding output files."