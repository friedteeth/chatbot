import base64
import json
import os

from openai import OpenAI

client = OpenAI()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")


def handler(event, _context):
    data = json.loads(event["body"])
    status_code = 200
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": data["message"]}
        ]
    )
    response = completion.choices[0].message.content

    with client.audio.speech.with_streaming_response.create(
        model="tts-1",
        voice="onyx",
        input=response,
    ) as voice_response:
        b64_encoded_data = base64.b64encode(voice_response.read())
        serialized_audio = b64_encoded_data.decode("utf-8")

    payload = {"response": response, "audio_response": serialized_audio}
    return {"statusCode": status_code, "body": json.dumps(payload)}


if __name__ == "__main__":
    # Test locally
    event = {"body": json.dumps({"message": "this is the message"})}
    response = handler(event, None)
    print(response)
