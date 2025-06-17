print("Before importing create_app")
from app import create_app
print("After importing create_app")

print("Calling create_app()...")
app = create_app()
print("App created")

if __name__ == '__main__':
    print("Running app")
    app.run(debug=True)
