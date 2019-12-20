from __future__ import print_function
import random
import pprint
import uuid
import sys

id = 0
word_file = "/usr/share/dict/words"
WORDS = open(word_file).read().splitlines()
WC = len(WORDS)

def getUniqueID():
	global id
	id += 1
	return id

def getGeometryId():
	return {
		"_id": str(uuid.uuid4())
	}

def getRandomWords(n):
	global WORDS, WC
	idx = random.sample(range(WC), n)
	idx.sort()
	w = [WORDS[i] for i in idx]
	return w

def getFileName():
	w = getRandomWords(1)
	return "./path/to/file/"+w[0]+".txt"

def getName(type):
	w = getRandomWords(1)
	return type+"_name_"+w[0]

def getStructureType(type, floor=None, n=None):
	s = {
		"_id": getUniqueID(),
		"name": getName(type),
		"type": type,
		"class": "structure",
		"geometry": getGeometryId()
	}

	return s

def getStructure(x):
	# 4 to 20 walls
	# 4 to 8 columns
	# 4 to 10 beams
	# 1 covering
	# 1 slab per floor
	n_walls = random.randint(4, 20)
	n_cols = random.randint(4, 8)
	n_beams = random.randint(4, 10)

	walls = [getStructureType("wall", x,i) for i in range(n_walls)]
	cols = [getStructureType("column", x,i) for i in range(n_cols)]
	beams = [getStructureType("beam", x,i) for i in range(n_beams)]
	slabs = [getStructureType("slab", x)]
	covering = [getStructureType("covering", x)]

	return {
		"walls": walls,
		"cols": cols,
		"beams": beams,
		"slabs": slabs,
		"covering": covering
	}

def getSupportStructureType(type, floor=None, n=None):
	s = {
		"_id": getUniqueID(),
		"name": getName(type),
		"type": type,
		"class": "support_structure",
		"geometry": getGeometryId()
	}

	return s

def getSupportStructure(x):
	n_ramps = random.randint(0, 4)
	n_rails = random.randint(0, 4)

	res = [getSupportStructureType("ramp", x, i) for i in range(n_ramps)]
	res += [getSupportStructureType("railing", x, i) for i in range(n_rails)]

	return res

def getFenestration(type, n):
	f = {
		"_id": getUniqueID(),
		"type": type,
		"name": getName(type),
		"geometry": getGeometryId()
	}
	return f

def getFurnishingElement(type, n=-1):
	materials = {
		"desk": "wood",
		"chair": "plastic",
		"whiteboard": "glass"
	}

	f = {
		"_id": getUniqueID(),
		"name": getName(type),
		"type": type,
		"geometry": getGeometryId(),
		"properties": {
			"isDesk": "true" if type=="desk" else "false",
			"cost": 100, # cost of asset
			"material": materials[type],
		}
	}

	if(type == "desk"):
		f["properties"]["isOccupied"] = "false"
		f["properties"]["HotOrNot"] = random.choice(["true", "false"])
		f["properties"]["price"] = 700
		f["properties"]["occupiedFrom"] = ""
		f["properties"]["occupiedTo"] = ""

	return f

def getSpaceType(type, floor=None, n=None):
	s = {
		"_id": getUniqueID(),
		"name": getName(type),
		"type": type,
		"class": "structure",
		"geometry": getGeometryId(),
		"carpet_area": random.randint(100,1000)
	}

	# adding windows only to rooms/conf room as of now
	if(type == "room" or type == "conference_room"):
		n_windows = random.randint(1, 3)
		n_desks = random.randint(1, 8)
		s["fenestrations"] = [getFenestration("window", i) for i in range(n_windows)]
		s["furnishing_elements"] = [getFurnishingElement("desk", i) for i in range(n_desks)]
		s["furnishing_elements"] += [getFurnishingElement("chair", i) for i in range(n_desks)]
		s["furnishing_elements"] += [getFurnishingElement("whiteboard")]

	return s

def getDoor(space1, space2):
	d = {
		"_id": getUniqueID(),
		"name": getName("door")
	}
	if(space2 != None):
		d["type"] = "door"
		d["connects"] = [space1["_id"], space2["_id"]]
	else:
		d["type"] = "exit_door"
		d["connects"] = [space1["_id"],-1]

	return d

def getConnectedSpace(x):
	# CorridorUnits are pathways with rooms connected to it.
	# there can be many CorridorUnits.
	# A CorridorUnit may be connected to a hall through a pathways/door
	# or to itself through a conference room by 2 doors.
	# one CorridorUnit must have restrooms and another a kitchen.
	# one CorridorUnit must have an exit door.

	res_s = [] # all spaces
	res_c = [] # all connectors

	all_cu = []
	n_corridors = random.randint(2,5) # need to have atleast 2 corridors
	for j in range(n_corridors):
		# CorridorUnit
		corridor = getSpaceType("corridor", n=j)
		res_s += [corridor]
		n_rooms = random.randint(1,4)
		for i in range(n_rooms):
			room = getSpaceType("room", n=i)
			res_s += [room]
			door = getDoor(room, corridor)
			res_c += [door]

		all_cu += [corridor] # add corridor unit to list

	hall = getSpaceType("hall")
	res_s += [hall]

	for cu in all_cu:
		# randomly choose to connect to hall or conf room or another cu
		dice = random.randint(0,2)
		if(dice == 0): # choose hall
			door = getDoor(hall, cu)
			res_c += [door]
		elif(dice == 1): # choose conf room
			room = getSpaceType("conference_room", n=i)
			door = getDoor(cu, room)
			cu2 = random.choice(all_cu)
			door2 = getDoor(room, cu2)

			res_s += [room]
			res_c += [door, door2]
		else: # choose another CU
			cu2 = random.choice(all_cu)
			door = getDoor(cu, cu2)

			res_c += [door]

	#now add restrooms to a corridor
	cu = random.choice(all_cu)
	restroom = getSpaceType("restroom")
	res_s += [restroom]
	door = getDoor(cu, restroom)
	res_c += [door]

	#now add a kitchen to a corridor
	cu = random.choice(all_cu)
	kitchen = getSpaceType("kitchen")
	res_s += [kitchen]
	door = getDoor(cu, kitchen)
	res_c += [door]

	# now add an exit door to one of the corridors
	door = getDoor(random.choice(all_cu), None)
	res_c += [door]

	return res_s, res_c

def getFloor(x):
	id = getUniqueID()
	space, connector = getConnectedSpace(x)
	f = {
		"_id": id,
		"number":x,
		"name": getName("floor"),
		"structures": getStructure(x),
		"support_structures": getSupportStructure(x),
		"spaces": space,
		"connectors": connector,
	}
	return f

def getBuilding():
	# a building can have upto 15 floors
	n = random.randint(1,15)
	b = [getFloor(x) for x in range(n)]

	return {
		"_id": getUniqueID(),
		"name": getName("building"),
		"num_floors": n,
		"floor": b
	}

def getSite():
	s = {
		"_id": getUniqueID(),
		"name": getName("site"),
		"geometry": getGeometryId(),
		"building": getBuilding()
	}
	return s

def getProject():
	p = {
		"_id": getUniqueID(),
		"file_name": getFileName(),
		"name": getName("project"),
		"site": getSite()
	}
	return p

def main():
	file_count = 10
	print("\n\n\n Generating Building Files. This may Take a while.\n -----------------------------------------------------------\n\n File Location: './buildings/'\n\n")
	printProgressBar(0, file_count, prefix = 'Progress:', suffix = 'Complete', length = 50)
	for i in range(file_count):
		printProgressBar(i + 1, file_count, prefix = '_Progress:', suffix = 'Complete', length = 50)
		proj = getProject()
		f = open("./buildings/building_"+str(i)+".json", "w")
		f.write(str(proj))
		f.close()
	# pprint.pprint(proj)

# Print iterations progress
def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '#'):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        length      - Optional  : character length of bar (Int)
        fill        - Optional  : bar fill character (Str)
    """
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(' \r%s |%s| %s%% ( %d/%d ) %s' % (prefix, bar, percent, iteration, total, suffix), end = '\r')
    sys.stdout.flush()
    # Print New Line on Complete
    if iteration == total: 
    	print()
        print(str(total)+" files generated successfully.")

if __name__ == "__main__":
	main()