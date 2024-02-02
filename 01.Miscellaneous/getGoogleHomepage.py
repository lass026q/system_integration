import requests

# URL of the Google homepage
url = 'https://www.google.com'

# Send a GET request to the URL
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Write the contents of the response to 'index.html'
    with open('index.html', 'w', encoding='utf-8') as file:
        file.write(response.text)
    print("The file has been saved!")
else:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
