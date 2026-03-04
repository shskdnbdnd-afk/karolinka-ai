from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"

@app.route("/")
def home():
    return "Karolinka API is running"

@app.route("/api/generate", methods=["POST"])
def generate():
    try:
        data = request.json

        prompt = data.get("prompt", "")
        model = data.get("model", "karolinka")

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            }
        )

        return jsonify(response.json())

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
