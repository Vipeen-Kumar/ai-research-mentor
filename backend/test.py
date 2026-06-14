from google import genai

client = genai.Client(
    api_key="AIzaSyCy_tgvl8DdgWbKC2iFrOFkTzhVsf-sn4o"
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Give me 3 learning topics for Computer Vision"
)

print(response.text)