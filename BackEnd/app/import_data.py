import csv
import json

def read_csv_to_json(csv_file_path):
    """
    Reads a CSV file and returns a list of dictionaries.
    Each dict is a row with column headers as keys.
    """
    try:
        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            data = list(reader)
        return data
    except Exception as e:
        raise RuntimeError(f"Error reading CSV: {e}")

def read_json_file(json_file_path):
    """
    Reads a JSON file and returns its contents as a Python object.
    """
    try:
        with open(json_file_path, mode='r', encoding='utf-8') as file:
            data = json.load(file)
        return data
    except Exception as e:
        raise RuntimeError(f"Error reading JSON: {e}")
