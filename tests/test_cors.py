import requests

def test_cors():
    print("Testing CORS headers...")
    try:
        response = requests.options("http://127.0.0.1:5000/predict")
        print("Status code:", response.status_code)
        print("Headers:", response.headers)
        if 'Access-Control-Allow-Origin' in response.headers:
            print("CORS is enabled.")
        else:
            print("CORS is NOT enabled.")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_cors()
