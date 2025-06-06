from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app) 


@app.route('/classify_image', methods=['POST'])
def classify_image():
    try:
        data = request.get_json()
        image_data = data['image']
        result = util.classify_image(image_data)
        return jsonify(result)
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 400


if __name__ == "__main__":
    print("Starting Python Flask Server For Face Classification")
    util.load_saved_artifacts()
    app.run(port=5000)