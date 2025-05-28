import requests
import sys
import os
from datetime import datetime

class VenueAPITester:
    def __init__(self, base_url="http://localhost:8001/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                return success, response.json() if response.content else {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_get_venues(self):
        """Test getting all venues"""
        success, response = self.run_test(
            "Get All Venues",
            "GET",
            "venues",
            200
        )
        if success:
            print(f"Retrieved {len(response)} venues")
        return success

    def test_get_venue_by_id(self, venue_id="1"):
        """Test getting a venue by ID"""
        success, response = self.run_test(
            f"Get Venue by ID ({venue_id})",
            "GET",
            f"venues/{venue_id}",
            200
        )
        if success:
            print(f"Retrieved venue: {response.get('name', 'Unknown')}")
        return success

def main():
    # Get backend URL from environment or use default
    backend_url = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001/api")
    
    # Setup tester
    tester = VenueAPITester(backend_url)
    
    # Run tests
    venues_test = tester.test_get_venues()
    if not venues_test:
        print("❌ Failed to get venues, stopping tests")
        return 1
    
    venue_detail_test = tester.test_get_venue_by_id("1")
    if not venue_detail_test:
        print("❌ Failed to get venue details, stopping tests")
        return 1
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
