import json
import yaml
from flask import Flask, request, jsonify

app = Flask(__name__)

xmlFile = "me.xml"
jsonFile = "me.json"
yamlFile = "me.yaml"
csvFile = "me.csv"
textFile = "me.txt"

def read_and_parse_text(text_content):
    # Parse text_content as needed
    return {"text_content": text_content}

def read_and_parse_xml(xmlFile):
    tree = ET.parse(xmlFile)
    root = tree.getroot()
    xml_content = [{elem.tag: elem.text} for elem in root.iter()]
    return {"xml_content": xml_content}

def read_and_parse_yaml(yamlFile):
    with open(yamlFile, 'r') as file:
        yaml_content = yaml.load(file, Loader=yaml.FullLoader)
    return {"yaml_content": yaml_content}

def read_and_parse_json(jsonFile):
    with open(jsonFile, 'r') as file:
        json_content = json.load(file)
    return {"json_content": json_content}

def read_and_parse_csv(csvFile):
    with open(csvFile, 'r') as file:
        csv_reader = csv.reader(file)
        csv_content = [row for row in csv_reader]
    return {"csv_content": csv_content}

@app.route('/parse_text', methods=['POST'])
def parse_text():
    data = request.get_json()
    text_content = data.get('text_content')
    result = read_and_parse_text(text_content)
    return jsonify(result)

@app.route('/parse_xml', methods=['GET'])
def parse_xml():
    result = read_and_parse_xml(xmlFile)
    return jsonify(result)

@app.route('/parse_yaml', methods=['GET'])
def parse_yaml():
    result = read_and_parse_yaml(yamlFile)
    return jsonify(result)

@app.route('/parse_json', methods=['GET'])
def parse_json():
    result = read_and_parse_json(jsonFile)
    return jsonify(result)

@app.route('/parse_csv', methods=['GET'])
def parse_csv():
    result = read_and_parse_csv(csvFile)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
    app.run(debug=True)
