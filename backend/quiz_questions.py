from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
@app.route('/generate_quiz', methods=['GET'])
def generate_quiz():
    # Parse the request body for dynamic prompts (optional)
    prompt ="Generate a quiz about graphs and graph algorithms. It will be 15 multiple-choice questions. Provide only the questions, answer choices, and answers in JSON format. Do not include any explanations or additional text."

    # Call OpenAI API
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Ensure this model is available in your OpenAI subscription
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Extract the response content
        raw_response = response.choices[0].message.content
        #print(raw_response)
        # Convert the string response into a JSON object
        import json
        import re
        json_match = re.search(r"\{.*\}|\[.*\]", raw_response, re.DOTALL)
        if json_match:
            raw_json = json_match.group(0)
            quiz_data = json.loads(raw_json)
        else:
            return jsonify({"error": "No valid JSON found in response"}), 500

        return jsonify(quiz_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)