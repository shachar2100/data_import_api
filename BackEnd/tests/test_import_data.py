import os
import pytest
from app.import_data import read_json_file, read_csv_to_json

def test_read_json_file():
    # Test reading the example JSON file
    data = read_json_file('data/ex_data.json')
    
    # Verify the structure and content
    assert isinstance(data, dict)
    assert data['name'] == 'John Doe'
    assert data['age'] == 30
    assert data['email'] == 'john.doe@example.com'

def test_read_json_file_invalid_path():
    # Test reading a non-existent JSON file
    with pytest.raises(RuntimeError):
        read_json_file('data/nonexistent.json')

def test_read_json_file_invalid_json():
    # Create a temporary invalid JSON file
    invalid_json_path = 'data/invalid.json'
    with open(invalid_json_path, 'w') as f:
        f.write('{invalid json}')
    
    try:
        # Test reading invalid JSON
        with pytest.raises(RuntimeError):
            read_json_file(invalid_json_path)
    finally:
        # Clean up the temporary file
        if os.path.exists(invalid_json_path):
            os.remove(invalid_json_path)

def test_read_csv_to_json():
    # Create a temporary CSV file for testing
    csv_path = 'data/test.csv'
    csv_content = """name,age,email
John Doe,30,john.doe@example.com
Jane Smith,25,jane.smith@example.com"""
    
    with open(csv_path, 'w') as f:
        f.write(csv_content)
    
    try:
        # Test reading the CSV file
        data = read_csv_to_json(csv_path)
        
        # Verify the structure and content
        assert isinstance(data, list)
        assert len(data) == 2
        assert data[0]['name'] == 'John Doe'
        assert data[0]['age'] == '30'
        assert data[0]['email'] == 'john.doe@example.com'
        assert data[1]['name'] == 'Jane Smith'
        assert data[1]['age'] == '25'
        assert data[1]['email'] == 'jane.smith@example.com'
    finally:
        # Clean up the temporary file
        if os.path.exists(csv_path):
            os.remove(csv_path)

def test_read_csv_to_json_invalid_path():
    # Test reading a non-existent CSV file
    with pytest.raises(RuntimeError):
        read_csv_to_json('data/nonexistent.csv') 