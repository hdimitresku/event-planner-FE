
import requests
import sys
import json
from datetime import datetime

class VenueBookingAPITester:
    def __init__(self, base_url="http://localhost:8001"):
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
                if response.content:
                    try:
                        return success, response.json()
                    except json.JSONDecodeError:
                        return success, response.content
                return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.content:
                    try:
                        print(f"Response: {response.json()}")
                    except json.JSONDecodeError:
                        print(f"Response: {response.content}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_get_venues(self):
        """Test getting all venues"""
        return self.run_test(
            "Get All Venues",
            "GET",
            "api/venues",
            200
        )

    def test_get_venue(self, venue_id):
        """Test getting a specific venue"""
        return self.run_test(
            f"Get Venue {venue_id}",
            "GET",
            f"api/venues/{venue_id}",
            200
        )

def main():
    # Setup
    tester = VenueBookingAPITester()
    
    # Run tests
    success, venues_response = tester.test_get_venues()
    if not success:
        print("❌ Failed to get venues, stopping tests")
        return 1
    
    print(f"Found {len(venues_response)} venues")
    
    # Test getting a specific venue if we have any
    if venues_response and len(venues_response) > 0:
        venue_id = venues_response[0]["id"]
        success, venue_response = tester.test_get_venue(venue_id)
        if not success:
            print(f"❌ Failed to get venue {venue_id}")
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
