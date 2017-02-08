from bs4 import BeautifulSoup
import re
f = open('courses_2017_spring.htm')
soup = BeautifulSoup(f,'html.parser')
f.close()

# Dictionary of dictionaries to store the course info
course_dict = {}

search_results = soup('section',{'id':'search-results'})
for result in search_results:
	for section in result.find_all('section'):
		for h1 in section.find_all('h1'):			
			id = h1.contents[0].strip()
			title = h1.contents[1].contents[0]

		special = False
		for tr in section.find_all('tr'):
			if len(tr.find_all('td'))>8:
				if tr.find_all('td')[8].contents:
					special = True

		if special:
			for tr in section.find_all('tr'):
				if len(tr.find_all('td'))>8:
					try:
						title = tr.find_all('td')[8].contents[0]
					except:
						title = None
					try:
						prereq = tr.find('a',{'data-title':re.compile('Class Requisites:.*')})['data-content'].strip('<p>').strip('</p>').strip()
					except:
						prereq = None
					try:
						desc = tr.find('a',{'data-title':re.compile('Class Notes:.*')})['data-content'].strip('<p>').strip('</p>').strip()
					except:
						desc = None
					de = False
					if 'Distance Education-Internet' in str(tr):
						de = True
					try:
						instructors = [tr.find_all('td')[6].contents[0].contents[0]]
					except:
						instructors = []

					if title:
						course_dict[id] = {title:{'desc':desc,'prereq':prereq,'offered':{'Spring 2017':instructors},'de':de}}

		else:
			p = section.find_all('p')
			if len(p)>1:
				desc = section.find_all('p')[0].contents[0]
				prereq = section.find_all('p')[1].contents[0].strip('Prerequisite:').strip()
			else:
				desc = section.find_all('p')[0].contents[0]
				prereq = None

			instructors = []
			for a in section.find_all('a',{'class':'instructor-link'}):
				instructors.append(a.contents[0])

			de = False
			if 'Distance Education-Internet' in str(section):
				de = True

			# Store the Course ID first - Initialize to description
			course_dict[id] = {title:{'desc':desc,'prereq':prereq,'offered':{'Spring 2017':instructors},'de':de}}


# print str(course_dict)

f = open('output.log','w')
for id in sorted(course_dict.keys()):
	for title in sorted(course_dict[id].keys()):
		f.write("ID : " + id)
		f.write('\n')
		f.write("TITLE : " + title)
		f.write('\n')
		f.write("DESCRIPTION : " + course_dict[id][title]['desc'])
		f.write('\n')
		f.write("PRE-REQUISITES : " + str(course_dict[id][title]['prereq']))
		f.write('\n')
		f.write("OFFERED : " + str(course_dict[id][title]['offered']))
		f.write('\n')
		f.write("DISTANCE EDUCATION : "+str(course_dict[id][title]['de']))
		f.write('\n')
		f.write('\n')
		
