# parser.py
import sys
import json
import csv
import xml.etree.ElementTree as ET
import yaml

xmlFile = "me.xml"
jsonFile = "me.json"
yamlFile = "me.yaml"
csvFile = "me.csv"
textFile = "me.txt"

def read_and_parse_text(textFile):
    with open(textFile, 'r') as file:
        text_content = file.read()
    print("Text content:")
    print(text_content)

def read_and_parse_xml(xmlFile):
    tree = ET.parse(xmlFile)
    root = tree.getroot()
    print("XML content:")
    for elem in root.iter():
        print(f"{elem.tag}: {elem.text}")

def read_and_parse_yaml(yamlFile):
    with open(yamlFile, 'r') as file:
        yaml_content = yaml.load(file, Loader=yaml.FullLoader)
    print("YAML content:")
    print(yaml_content)

def read_and_parse_json(jsonFile):
    with open(jsonFile, 'r') as file:
        json_content = json.load(file)
    print("JSON content:")
    print(json_content)

def read_and_parse_csv(csvFile):
    with open(csvFile, 'r') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            print(row)

if __name__ == "__main__":
    print("Choose a function to run:")
    print("1. Read and Parse Text")
    print("2. Read and Parse XML")
    print("3. Read and Parse YAML")
    print("4. Read and Parse JSON")
    print("5. Read and Parse CSV")

    choice = input("Enter the number of your choice (1-5): ")

    if choice not in ['1', '2', '3', '4', '5']:
        print("Invalid choice. Exiting.")
        

    if choice == '1':
        read_and_parse_text(textFile)
    elif choice == '2':
        read_and_parse_xml(xmlFile)
    elif choice == '3':
        read_and_parse_yaml(yamlFile)
    elif choice == '4':
        read_and_parse_json(jsonFile)
    elif choice == '5':
        read_and_parse_csv(csvFile)
