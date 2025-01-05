from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import json
import re

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")  # Set Neon DB URL in .env
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(200), nullable=False)
    questions = db.relationship('QuizQuestion', backref='quiz', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "topic": self.topic,
            "questions": [question.to_dict() for question in self.questions]
        }

class QuizQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    question = db.Column(db.String(500), nullable=False)
    answer = db.Column(db.String(200), nullable=False)
    choices = db.Column(db.Text, nullable=False)  # Store choices as a JSON string

    def to_dict(self):
        return {
            "id": self.id,
            "question": self.question,
            "answer": self.answer,
            "choices": json.loads(self.choices)  # Convert JSON string back to list
        }
@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    if not data or 'topic' not in data:
        return jsonify({"error": "Topic not provided"}), 400

    topic = data['topic']
    prompt = (
        f"Generate a quiz about {topic}. "
        "Provide exactly 15 multiple-choice questions, answers, and answer choices "
        "strictly in JSON array format. The output must only include the JSON array, "
        "with no additional text, labels, or explanations. The json array will have questions, choices, and the answer"
    )

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
        json_match = re.search(r"\{.*\}|\[.*\]", raw_response, re.DOTALL)
        if json_match:
            raw_json = json_match.group(0)
            quiz_data = json.loads(raw_json)
        else:
            return jsonify({"error": "No valid JSON found in response"}), 500
        new_quiz = Quiz(topic=topic)
        db.session.add(new_quiz)
        db.session.flush()  # Ensure the quiz ID is available

        # Save each question to the database
        for item in quiz_data:
            question = item.get("question")
            answer = item.get("answer")
            choices = json.dumps(item.get("choices", []))  # Convert choices to JSON string

            quiz_question = QuizQuestion(quiz_id=new_quiz.id, question=question, answer=answer, choices=choices)
            db.session.add(quiz_question)

        db.session.commit()  # Commit all changes to the database
        return jsonify({"id": new_quiz.id, "quiz": quiz_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_quizzes', methods=['GET'])
def get_quizzes():
    quizzes = Quiz.query.all()
    return jsonify([quiz.to_dict() for quiz in quizzes]), 200

@app.route('/get_quiz/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    return jsonify(quiz.to_dict()), 200

@app.route('/delete_quiz/<int:quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    db.session.delete(quiz)
    db.session.commit()
    return jsonify({"message": f"Quiz with ID {quiz_id} has been deleted."}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)