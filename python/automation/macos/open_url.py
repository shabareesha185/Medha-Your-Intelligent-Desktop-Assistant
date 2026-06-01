import sys
import subprocess

url = sys.argv[1]

# Use native macOS 'open' utility to reliably launch default browser with the URL
subprocess.Popen(["open", url])

print(f"Opened {url}")