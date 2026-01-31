#!/bin/bash

# Script to start the ACL Detection Backend Server

echo "🚀 Starting ACL Tear Detection Backend Server..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Check if requirements are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    echo "✅ Dependencies installed"
    echo ""
fi

# Start the server
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "   Press CTRL+C to stop the server"
echo ""
uvicorn main:app --reload --port 8000
