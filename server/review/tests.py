from django.test import TestCase
import json

# Write general tests here
def mock_feide_apis(url, headers):
    if url == 'https://groups-api.dataporten.no/groups/me/groups':
        if headers["authorization"] == 'Bearer valid_token':
            with open("review/test_data/mock_groups_api_call.json", "r") as f:
                return MockAPIRequest(json.load(f))
        else:
            with open("review/test_data/invalid_groups_api_response.json", "r") as f:
                return MockAPIRequest(json.load(f))
    elif url == "https://auth.dataporten.no/openid/userinfo":
        if headers["authorization"] == 'Bearer valid_token':
            with open("review/test_data/mock_userinfo_response.json", "r") as f:
                return MockAPIRequest(json.load(f))
        # missing user in our database, not on feides part.
        elif headers["authorization"] == 'Bearer valid_token_missing_user':
            with open("review/test_data/mock_userinfo_missing_user_response.json", "r") as f:
                return MockAPIRequest(json.load(f))
        else:
            with open("review/test_data/invalid_token_userinfo_response.json", "r") as f:
                return MockAPIRequest(json.load(f))


class MockAPIRequest:
    def __init__(self, contents):
        self.contents = contents

    def json(self):
        return self.contents