# app.py
from flask import Flask, render_template, request, jsonify
import assemblyai as aai
import os
from groq import Groq
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


ALLOWED_EXTENSIONS = {'wav', 'mp3'}
GROQ_API_KEY = "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"
ASSEMBLYAI_API_KEY = "a789b7873d09463eae68cedfe9cb5085"

aai.settings.api_key = ASSEMBLYAI_API_KEY

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_audio(audio_path):

    config = aai.TranscriptionConfig(speaker_labels=True)
    transcriber = aai.Transcriber()

    transcript = transcriber.transcribe(
        audio_path,
        config=config
    )
    
    
    result = ""
    for utterance in transcript.utterances:
        result += f"Speaker {utterance.speaker}: {utterance.text}\n"
    
   
    result = result[:6000]
    

    client = Groq(api_key=GROQ_API_KEY)
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{
            "role": "user",
            "content": result + "Summarize the conversation in detail providing key insights, takeaways"
        }],
        temperature=1,
        max_tokens=1024,
        top_p=1,
    )
    
    summary = completion.choices[0].message.content

    return {
        'transcription': result,
        'summary': summary
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            result = process_audio(filepath)
            # Clean up
            os.remove(filepath)
            
            return jsonify(result)
        except Exception as e:
            # Clean up in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)