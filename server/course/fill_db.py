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
		Course.create(code=course_dict["code"], name=course_dict["norwegian_name"].strip(), credit=course_dict["credit"],
					  average_grade=course_dict["average"], pass_rate=course_dict["pass_rate"]).save()


def add_pass_rate(course_list):
	"""
	Adds the pass rate of the previous five years (from the last time the course was held) to the courses in the list,
	to later be saved in the db.

	:param course_list: List of dict, list of course information for courses.
	"""
	for course_dict in course_info_list:
		course_response = requests.get("https://grades.no/api/v2/courses/{}/grades/".format(course_dict["code"]))
		course_response.encoding = "utf-8"
		course_grades = course_response.json()
		# This doesn't sort correctly within each year, not necessary.
		course_grades.sort(key=lambda c: c.get("year"), reverse=True)
		previous_held_exam_year = course_grades[0].get("year")
		attendees = 0
		flunks = 0
		#
		for exam in course_grades:
			if exam.get("year") <= previous_held_exam_year-5:
				break
			else:
				attendees += exam.get("attendee_count")
				flunks += exam.get("f")
		pass_rate = (1 - flunks / attendees) * 100
		course_dict["pass_rate"] = pass_rate


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
	add_pass_rate(course_info_list)
	save_courses(course_info_list)
	pbar.update(len(course_info_list))
print("Fetch complete! Stored {} courses in the data base.".format(count))
