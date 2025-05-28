from setuptools import setup, find_packages

setup(
    name="volsum",
    version="0.1.0",
    description="A medical record analysis tool",
    author="Your Name",
    author_email="emmanuelterah98@gmail.com",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.109.2",
        "uvicorn==0.27.1",
        "python-jose[cryptography]==3.3.0",
        "passlib[bcrypt]==1.7.4",
        "python-multipart==0.0.9",
        "pydantic==2.6.1",
        "python-dotenv==1.0.1",
        "spacy==3.7.4",
        "numpy==1.26.4",
        "pandas==2.2.1",
        "scikit-learn==1.4.1.post1",
        "httpx==0.26.0",
        "sqlalchemy",
        "psycopg2-binary",  # PostgreSQL adapter
    ],
    python_requires=">=3.8",
) 