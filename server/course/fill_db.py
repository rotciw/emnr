import requests
from tqdm import tqdm
from course.models import Course

"""
How to run:

Open a Django shell, by typing $ python manage.py shell
Then, run the command >>> exec(open("course/fill_db.py").read()).
This will populate the database with all courses available 
from the grades.no API.
"""


def save_courses(course_list):
	"""
	Saves a list of course information dictionaries to the database.

	:param course_list: List of dict, List of course information for courses
	"""
	for course_dict in course_info_list:
		Course.create(code=course_dict["code"], name=course_dict["norwegian_name"], credit=course_dict["credit"], average_grade=course_dict["average"]).save()


# Set API call parameters:
limit = 100
offset = 0
next_url = "https://grades.no/api/v2/courses/?limit={}&offset={}".format(limit, offset)

# Fetch the total number of courses
count = requests.get("https://grades.no/api/v2/courses/?limit=1").json()["count"]

# Initialize progress bar
pbar = tqdm(total=count, desc="Fetching data from API")

# Fetch and save course data from API:
while next_url is not None:
	response = requests.get(url=next_url)
	response.encoding = "utf-8"		# Added for efficiency purposes
	data = response.json()
	next_url = data["next"]			# Get URL for next API call
	course_info_list = data["results"]
	save_courses(course_info_list)
	pbar.update(len(course_info_list))
print("Fetch complete! Stored {} courses in the data base.".format(count))
