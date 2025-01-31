# app.py
from flask import Flask, render_template, request, jsonify
from time import time
import assemblyai as aai
import os
from groq import Groq
from werkzeug.utils import secure_filename
import json


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 70 * 1024 * 1024  # 70MB max file size

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


ALLOWED_EXTENSIONS = {'wav', 'mp3'}
GROQ_API_KEY = "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"
ASSEMBLYAI_API_KEY = "a789b7873d09463eae68cedfe9cb5085"

aai.settings.api_key = ASSEMBLYAI_API_KEY

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_default_summary():
    return {
        "overview": "No meeting overview available",
        "keyPoints": ["No key points available"],
        "actionItems": ["No action items available"],
        "decisions": ["No decisions available"],
        "nextSteps": ["No next steps available"]
    }

def process_audio(audio_path):
    print("\n=== Starting Audio Processing ===")
    
    # Timing for AssemblyAI transcription
    transcription_start = time()
    config = aai.TranscriptionConfig(speaker_labels=True)
    transcriber = aai.Transcriber()

    transcript = transcriber.transcribe(
        audio_path,
        config=config
    )
    transcription_end = time()
    print(f"Transcription time: {transcription_end - transcription_start:.2f} seconds")
    
    result = ""
    timestamp_mapping = []
    for utterance in transcript.utterances:
        # Keep the original text format
        text = f"Speaker {utterance.speaker}: {utterance.text}"
        result += f"{text}\n"
        timestamp_mapping.append({
            "text": text,
            "start_time": utterance.start
        })
    
    # print("Timestamp mapping:", json.dumps(timestamp_mapping, indent=2))
    
    result = result[:20000]
    
    prompt = f"""Based on this conversation: {result}

Provide a structured summary in VALID JSON format. Include a brief overview paragraph followed by key insights and action points.
Format STRICTLY as follows:

{{
    "overview": "Write a 2-3 sentence executive summary of the meeting's main topics and outcomes.",
    "keyPoints": [
        "Important insight: [concise point with context]",
        "Critical discussion: [key topic and its significance]",
        "Notable finding: [important discovery or conclusion]"
    ],
    "actionItems": [
        "Priority task: [specific action with owner]",
        "Required follow-up: [clear next steps]",
        "Deadline item: [task with timeline]"
    ],
    "decisions": [
        "Approved: [specific decision with context]",
        "Agreement reached: [clear consensus point]",
        "Resolved: [final determination]"
    ],
    "nextSteps": [
        "Immediate action: [next step with timeline]",
        "Follow-up required: [specific follow-up item]",
        "Scheduled: [upcoming task or meeting]"
    ]
}}

IMPORTANT: 
1. Overview should be concise but informative
2. Each bullet point should be specific and actionable
3. Use professional business language
4. Include context where relevant
5. Keep points clear and meaningful"""

    # Timing for Groq API call
    groq_start = time()
    client = Groq(api_key=GROQ_API_KEY)
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=1024,
        top_p=1,
    )
    
    try:
        summary = completion.choices[0].message.content
        # Try to parse the response as JSON
        summary_json = json.loads(summary)
        
        # Validate that all required keys are present
        required_keys = ["overview", "keyPoints", "actionItems", "decisions", "nextSteps"]
        if not all(key in summary_json for key in required_keys):
            summary_json = create_default_summary()
            
        # Ensure each section is a list
        for key in required_keys:
            if not isinstance(summary_json[key], list):
                summary_json[key] = [str(summary_json[key])]
        
        # Convert back to JSON string
        formatted_summary = json.dumps(summary_json)
        
        groq_end = time()
        print(f"Groq API processing time: {groq_end - groq_start:.2f} seconds")
        
    except (json.JSONDecodeError, KeyError, AttributeError) as e:
        print(f"Error processing Groq response: {str(e)}")
        formatted_summary = json.dumps(create_default_summary())

    total_time = time() - transcription_start
    print(f"Total processing time: {total_time:.2f} seconds")
    print("=== Processing Complete ===\n")

    return {
        'transcription': result,
        'summary': formatted_summary,
        'timestamp_mapping': json.dumps(timestamp_mapping)  # Convert to JSON string
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
    start = time()
    app.run(debug=True)
    end = time()
    print(f"Server started in {end - start} seconds")