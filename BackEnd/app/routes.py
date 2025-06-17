import requests
from flask import Blueprint, request, jsonify
from app.config import SUPABASE_REST as rest
from datetime import datetime
from app.import_data import read_csv_to_json
import uuid
import os
from werkzeug.utils import secure_filename

items_bp = Blueprint('items', __name__, url_prefix='/')

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@items_bp.route('/user', methods=['POST'])
def add_user():
    data = request.get_json()
    user_data = {
        "uuid": str(uuid.uuid4()),
        "userName": data.get("user_name"),
        "password": data.get("password"),
        "created_at": datetime.utcnow().isoformat()
    }

    # Check if user already exists
    existing_user = requests.get(
        f"{rest['url']}/rest/v1/Users",
        headers={
            "apikey": rest["api_key"],
            "Authorization": f"Bearer {rest['api_key']}",
            "Content-Type": "application/json"
        },
        params={
            "userName": f"eq.{user_data['userName']}"
        }
    )

    if existing_user.status_code == 200 and existing_user.json():
        return jsonify({"error": "Username already exists"}), 400

    response = requests.post(
        f"{rest['url']}/rest/v1/Users",
        headers={
            "apikey": rest["api_key"],
            "Authorization": f"Bearer {rest['api_key']}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        },
        json=user_data
    )

    if response.status_code >= 200 and response.status_code < 300:
        return jsonify(response.json()), 200
    else:
        return jsonify({"error": response.text}), 400

@items_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("user_name")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    response = requests.get(
        f"{rest['url']}/rest/v1/Users",
        headers={
            "apikey": rest["api_key"],
            "Authorization": f"Bearer {rest['api_key']}",
            "Content-Type": "application/json"
        },
        params={
            "userName": f"eq.{username}",
            "password": f"eq.{password}"
        }
    )

    if response.status_code != 200:
        return jsonify({"error": "Failed to query database"}), 500

    user_data = response.json()
    if not user_data:
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({"message": "Login successful", "user": user_data[0]}), 200

def get_user_uuid(username):
    """
    Helper function to get user UUID from username
    
    Args:
        username (str): The username to look up
        
    Returns:
        tuple: (user_uuid, error_response)
            - user_uuid (str): The UUID if found
            - error_response (tuple): (error_message, status_code) if error occurs
    """
    response = requests.get(
        f"{rest['url']}/rest/v1/Users",
        headers={
            "apikey": rest["api_key"],
            "Authorization": f"Bearer {rest['api_key']}",
            "Content-Type": "application/json"
        },
        params={
            "userName": f"eq.{username}"
        }
    )

    if response.status_code != 200:
        return None, ({"error": "Failed to query database"}, 500)

    user_data = response.json()
    if not user_data:
        return None, ({"error": "User not found"}, 404)

    return user_data[0]['uuid'], None

@items_bp.route('/<username>', methods=['POST'])
def import_csv(username):
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not file.filename.endswith('.csv'):
        return jsonify({"error": "File must be a CSV"}), 400

    try:
        user_uuid, error = get_user_uuid(username)
        if error:
            return jsonify(error[0]), error[1]

        # Save the file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Read and process the CSV
        file_directory_data_json = read_csv_to_json(filepath)
        if not file_directory_data_json:
            return jsonify({"error": "Failed to read CSV file"}), 400

        # Clean up the temporary file
        os.remove(filepath)

        success_count = 0
        error_count = 0
        for row in file_directory_data_json:
            current_row = {
                "id": str(uuid.uuid4()),
                "created_at": datetime.utcnow().isoformat(),
                "user_uuid": user_uuid,
                "lead_id": row["Lead ID"],
                "lead_name": row["Lead Name"],
                "contact_information": row["Contact Information"],
                "source": row["Source"],
                "interest_level": row["Interest Level"],
                "status": row["Status"],
                "salesperson": row["Assigned Salesperson"]
            }
            response = requests.post(
                f"{rest['url']}/rest/v1/Lead",
                headers={
                    "apikey": rest["api_key"],
                    "Authorization": f"Bearer {rest['api_key']}",
                    "Content-Type": "application/json"
                },
                json=current_row
            )
            if response.status_code >= 200 and response.status_code < 300:
                success_count += 1
            else:
                error_count += 1

        return jsonify({"success_count": success_count, "error_count": error_count}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@items_bp.route('/<username>', methods=['GET'])
def get_leads(username):
    try:
        user_uuid, error = get_user_uuid(username)
        if error:
            return jsonify(error[0]), error[1]

        # Start with filtering by user_uuid
        params = {
            "user_uuid": f"eq.{user_uuid}"
        }

        # Get query parameters from URL instead of request body for GET requests
        filter_fields = {
            "lead_id": "lead_id",
            "lead_name": "lead_name",
            "contact_information": "contact_information",
            "source": "source",
            "interest_level": "interest_level",
            "status": "status",
            "salesperson": "salesperson"
        }

        for key, db_field in filter_fields.items():
            value = request.args.get(key)
            if value:
                params[db_field] = f"eq.{value}"

        response = requests.get(
            f"{rest['url']}/rest/v1/Lead",
            headers={
                "apikey": rest["api_key"],
                "Authorization": f"Bearer {rest['api_key']}",
                "Content-Type": "application/json"
            },
            params=params
        )

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch leads"}), 500

        leads = response.json()
        return jsonify(leads), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500