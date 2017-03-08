import sys,os
import json

# Test 1 - Code should return a JSON object of a list if correct input is provided 
print "Test 1 - Code should return a JSON object of a list if correct input is provided"
try:
	cmd = "node get_data_from_piazza.js '{\"prof_rating\":1,\"grades\":0.5,\"content\":0.5,\"job\":0,\"workload\":0.5}'"
	output = os.popen(cmd).read()
	# print output.replace("'","\"")
	if type(json.loads(str(output.replace("'","\"")))) is list:
		print "PASSED"
	else:
		print "FAILED"
except:
	print "FAILED"

# Test 2 - Code should return a String object (error message) if wrong input is provided 
print "Test 2 - Code should return a String object (error message) if wrong input is provided"
try:
	cmd = "node get_data_from_piazza.js 'abc'"
	output = os.popen(cmd).read()

	if type(output) is str:
		print "PASSED"
	else:
		print "FAILED"
except:
	print "FAILED"

# Test 3 - If Piazza is not reachable (Simulate by turning off WiFi). It should return an error message
print "Test 3 - If Piazza is not reachable (Simulate by turning off WiFi). It should return an error message"
print "This test will pass ONLY if connectivity is off."
try:
	cmd = "node get_data_from_piazza.js '{\"prof_rating\":1,\"grades\":0.5,\"content\":0.5,\"job\":0,\"workload\":0.5}'"
	output = os.popen(cmd).read()
	# print output.replace("'","\"")
	if "OOPS" in output:
		print "PASSED"
	else:
		print "FAILED"
except:
	print "FAILED"