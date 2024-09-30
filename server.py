# Import the required modules
from pydantic import BaseModel
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, RedirectResponse
from ibm_watson_machine_learning.foundation_models import Model
from ibm_watson_machine_learning.metanames import GenTextParamsMetaNames as GenParams
import os
from dotenv import find_dotenv, load_dotenv
load_dotenv(find_dotenv(".env"))


# Load environment variables
WX_API_KEY = os.getenv("API_KEY")
WX_PROJECT_ID = os.getenv("PROJECT_ID")
IBM_CLOUD_URL = os.getenv("IBM_CLOUD_URL")

CREDENTIALS = {
    "url": IBM_CLOUD_URL,
    "apikey": WX_API_KEY
}

MODEL_ID = "mistralai/mixtral-8x7b-instruct-v01"
PARAMS = {
    GenParams.DECODING_METHOD: "greedy",
    GenParams.MAX_NEW_TOKENS: 1000
}


# Initialize the app and add CORS middleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=["*"]
)


# Define the RAG prompt template
RAG_PROMPT = """<s>[INST] You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.
If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.

Question:
{question}
[/INST]
"""


# Define the API endpoint
@app.post('/api/askcricketgpt')
async def stream_response(request:Request):
    payload_data = await request.json()
    try: 
        query = payload_data["query"].strip()
        model = Model(
            model_id = MODEL_ID, 
            params = PARAMS, 
            credentials = CREDENTIALS,
            project_id = WX_PROJECT_ID
        )
        input_prompt = RAG_PROMPT.format(question=query)
        return StreamingResponse(model.generate_text_stream(prompt=input_prompt), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Exception occurred: " + str(e))