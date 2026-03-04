from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

# Головна сторінка
@app.route("/")
def index():
    return render_template("index.html")


# API для чат-бота Karolinka
@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")

    if not user_message.strip():
        return jsonify({"response": "Будь ласка, введіть повідомлення 😊"}), 400

    try:
        # Запит до Ollama через ngrok
        response = requests.post(
            "https://lemony-luke-unabating.ngrok-free.dev/api/generate",
            json={
                "model": "karolinka",
                "prompt": user_message,
                "stream": False,
                "options": {
                    "temperature": 0.8,
                    "repeat_penalty": 1.1
                }
            },
            timeout=60
        )

        response.raise_for_status()
        bot_response = response.json().get(
            "response",
            "Karolinka не може відповісти зараз 😔"
        )

    except requests.exceptions.RequestException as e:
        bot_response = f"Помилка з'єднання з AI: {str(e)}"
    except Exception as e:
        bot_response = f"Невідома помилка: {str(e)}"

    return jsonify({"response": bot_response})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
