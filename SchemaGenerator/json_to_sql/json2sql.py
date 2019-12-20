#sample JSON
import pprint
# initialize schema
def initSchema():
	return """
CREATE table Projects (projectId serial Primary key, name varchar(100) unique not null, file_name varchar (100));
CREATE table Sites (siteId serial Primary key, name varchar(100) unique not null, geometry varchar (100));
CREATE table ProjectsToSitesMapping (projectId integer references Projects(projectId), siteId integer references Sites(siteId), PRIMARY KEY(projectId, siteId));

CREATE table Buildings (buildingId serial Primary key, name varchar(100) unique not null, num_floors smallint);
CREATE table SitesToBuildingsMapping (siteId integer references Sites(siteId), buildingId integer references Buildings(buildingId), PRIMARY KEY(siteId, buildingId));

CREATE table Floors (floorId serial primary key, name varchar(100) not null, fNumber smallint);
CREATE table BuildingsToFloorsMapping (buildingId integer references Buildings(buildingId), floorId integer references Floors(floorId), PRIMARY KEY(buildingId, floorId));

CREATE table ItemType (typeId serial primary key, class varchar(100) not null, type varchar(100) not null);
CREATE table Items (itemId serial primary key, name varchar(100) not null, type integer references ItemType(typeId), geometry varchar(100));
CREATE table ItemProperties (propId serial primary key, isDesk boolean, isHot boolean, isOccupied boolean, price smallint, cost smallint, area smallint, material varchar(100));

CREATE table FloorToStructureMapping (floorId integer references Floors(floorId), structureId integer references Items(itemId), primary key(floorId, structureId));
CREATE table SpaceToItemMapping (spaceId integer references Items(itemId), itemId integer references Items(itemId), primary key(spaceId, itemId));
CREATE table ItemToPropertyMapping (itemId integer references Items(itemId), propId integer references ItemProperties(propId), primary key(itemId, propId));

CREATE table Annotations (annotationId serial primary key, itemId integer references Items(itemId), comments varchar(500));
	"""

# delete all tables
def dropSchema():
	return """
		DROP table itemtopropertymapping;
		DROP table floortostructuremapping;
		DROP table projectstositesmapping;
		DROP table sitestobuildingsmapping;
		DROP table spacetoitemmapping;
		DROP table Annotations;
		DROP table sites;
		DROP table projects;
		DROP table itemProperties;
		DROP table items;
		DROP table itemType;
		DROP table floors;
		DROP table buildings;
	"""

def populateItemTypes():
	# typeid, class, type
	types = [
		[ 1, "structure", "beam"],
		[ 2, "structure", "wall"],
		[ 3, "structure", "column"],
		[ 4, "structure", "slab"],
		[ 5, "structure", "covering"],

		[ 6, "connector", "door"],
		[ 7, "connector", "exit_door"],
		[ 8, "connector", "pathway"],

		[ 10, "space", "room"],
		[ 11, "space", "conference_room"],
		[ 12, "space", "restroom"],
		[ 13, "space", "kitchen"],
		[ 14, "space", "hall"],
		[ 15, "space", "corridor"],


		[ 26, "furnishing_element", "desk"],
		[ 27, "furnishing_element", "chair"],
		[ 28, "furnishing_element", "whiteboard"],

		[ 17, "support_structure", "ramp"],
		[ 18, "support_structure", "railing"],

		[ 31, "fenestration", "window"],

	];
	return types


def flatten(json):
	final = {}
	def expand(json, item, parent_id):
		to_expand = []
		record = {}
		record["parent_id"] = parent_id
		for key in json.keys():
			if type(json[key]) is list:
				if(key == "connects"):
					record[key] = json[key]
				else:
					to_expand.append((json["_id"], key))
			elif type(json[key]) is dict:
				if(key == "geometry"):
					record[key] =json[key]["_id"]
				else:
					to_expand.append((json["_id"], key))
			else:
				record[key] =json[key]

		# print(record)
		if(item not in final):
			final[item] = []

		final[item].append(record)
		for parent_id, item in to_expand:
			if(type(json[item]) is list):
				[expand(json[item][i], item, parent_id) for i in range(len(json[item]))]
			else:
				if(item == "structures"):
					json[item]["_id"] = parent_id
				expand(json[item], item, parent_id)

	expand(json, "project", -1);
	return final

counter = 0
def get_unique_id():
	global counter
	counter += 1
	return counter

def collect(json):
	all_keys = ['building', 'floor', 'structures', 'covering', 'site', 'furnishing_elements', 'cols', 'project', 'connectors', 'spaces', 'walls', 'slabs', 'beams', 'support_structures', 'properties', 'fenestrations']
	items_alias = ['structures', 'covering', 'furnishing_elements', 'cols', 'connectors', 'spaces', 'walls', 'slabs', 'beams', 'support_structures', 'fenestrations']
	types_map = {i[2]: i[0] for i in populateItemTypes()}
	carpet_area_cache = {}
	# print(types_map)

	flat = flatten(json)

	# grouped = {
	# 	"projects": [("projectid", "name", "file_name")],
	# 	"sites": [("siteid", "name", "geometry")],
	# 	"buildings": [("buildingid", "name", "num_floors")],
	# 	"floors": [("floorid", "name", "fnumber")],
	# 	"items": [("itemid", "name", "type", "geometry")],
	# 	"properties": [("propid", "isdesk", "ishot", "isoccupied", "price", "cost", "area", "material")],

	# 	"ProjectsToSitesMapping": [("projectid", "siteid")],
	# 	"SitesToBuildingsMapping": [("siteid", "buildinid")],
	# 	"BuildingsToFloorsMapping": [("buildingid", "floorid")],
	# 	"FloorToStructureMapping": [("floorid", "structureid")], # floor contains space, and every other item
	# 	"SpaceToItemMapping": [("spaceid", "itemid")], # space contains furnishing_elem and fenestrations
	# 	"ItemToPropertyMapping": [("itemid", "propid")]
	# }
	grouped = {
		"projects": [],
		"sites": [],
		"buildings": [],
		"floors": [],
		"items": [],
		"properties": [],

		"ProjectsToSitesMapping": [],
		"SitesToBuildingsMapping": [],
		"BuildingsToFloorsMapping": [],
		"FloorToStructureMapping": [], # floor contains space, and every other item
		"SpaceToItemMapping": [], # space contains furnishing_elem and fenestrations
		"ItemToPropertyMapping": [],

		"connections": []
	}

	for k in all_keys:
		# print(k)
		if k in items_alias:
			if(k == "structures"):
				continue
			# needs itemid, name, type, geometry
			# print ("itemid", "name", "type", "geometry")
			all_items = flat[k]
			for i in all_items:
				# caching capet area to store into properties
				if(k == "spaces"):
					carpet_area_cache[i.get("_id")] = i.get("carpet_area")
				if(k == "connectors"):
					r = (i.get("_id"), i.get("connects")[0], i.get("connects")[1])
					grouped["connections"].append(r);

				r = (i.get("_id"), i.get("name"), types_map[i.get("type")], i.get("geometry", None))
				# print(r, i.get("parent_id"))
				grouped["items"].append(r)

				# mappings
				m = (i.get("parent_id"), i.get("_id"))
				if(k in ["furnishing_elements", "fenestrations"]):
					grouped["SpaceToItemMapping"].append(m)
				else:
					grouped["FloorToStructureMapping"].append(m)

		elif k == "project":
			# needs floorid, name, fnumber
			# print("projectid", "name", "file_name")
			all_projects = flat["project"]
			for p in all_projects:
				r = (p.get("_id"), p.get("name"), p.get("file_name"))
				# print(r, p.get("parent_id"))
				grouped["projects"].append(r)

				# no mapping

		elif k == "site":
			# needs floorid, name, fnumber
			# print("siteid", "name", "geometry")
			all_sites = flat["site"]
			for s in all_sites:
				r = (s.get("_id"), s.get("name"), s.get("geometry"))
				# print(r, s.get("parent_id"))
				grouped["sites"].append(r)

				# mappings
				m = (s.get("parent_id"), s.get("_id"))
				grouped["ProjectsToSitesMapping"].append(m)


		elif k == "building":
			# needs buildingid, name, num_floors
			# print("buildingid", "name", "num_floors")
			all_buidings = flat["building"]
			for b in all_buidings:
				r = (b.get("_id"), b.get("name"), b.get("num_floors"))
				# print(r, b.get("parent_id"))
				grouped["buildings"].append(r)

				# mappings
				m = (b.get("parent_id"), b.get("_id"))
				grouped["SitesToBuildingsMapping"].append(m)


		elif k == "floor":
			# needs floorid, name, fnumber
			# print("floorid", "name", "fnumber")
			all_floors = flat["floor"]
			for f in all_floors:
				r = (f.get("_id"), f.get("name"), f.get("number"))
				# print(r, f.get("parent_id"))
				grouped["floors"].append(r)

				# mappings
				m = (f.get("parent_id"), f.get("_id"))
				grouped["BuildingsToFloorsMapping"].append(m)


		elif k == "properties":
			# needs isdesk, ishot, isoccupied, price, cost, area, material
			# print("isdesk", "ishot", "isOccupied", "price", "cost", "area", "material")
			all_props = flat["properties"]
			for p in all_props:
				_id = get_unique_id()
				r = (_id, p.get("isDesk", None), "true" if p.get("HotOrNot", "n")=="true" else "false", p.get("isOccupied", None), p.get("price", None), p.get("cost", None), None, p.get("material", None))
				# print(r, p.get("parent_id"))
				grouped["properties"].append(r)

				# mappings
				m = (p.get("parent_id"), _id)
				grouped["ItemToPropertyMapping"].append(m)

	# create property row for carpet area
	for k in carpet_area_cache.keys():
		_id = get_unique_id()
		r = (_id, "false", "false", "false", None, 100, carpet_area_cache[k], None)
		# print(r, k)
		grouped["properties"].append(r)
		# mappings
		m = (k, _id)
		grouped["ItemToPropertyMapping"].append(m)

	return grouped

import csv
from os import listdir
from os.path import isfile, join
import json

def write_to_csv(json):
	grouped = collect(json)
	for key in grouped.keys():
		with open(join('.','export',key+'.csv'), 'a') as csvfile:
		    csvwriter = csv.writer(csvfile, delimiter=',')
		    [csvwriter.writerow(i) for i in grouped[key]]
	    
def read_json(location):
	all_files = [f for f in listdir(location) if isfile(join(location, f)) and ".json" in f]

	print(all_files)
	for file in all_files:
		with open(join(location, file)) as json_file:
			data = json_file.read()
			data = data.replace("'", '"')
			data = json.loads(data)
			# print(data)

		write_to_csv(data)

def copy_data():
	query = ""
	tables_list = [
		"projects",
		"sites",
		"buildings",
		"floors",
		"items",
		"properties",
		"ProjectsToSitesMapping",
		"SitesToBuildingsMapping",
		"BuildingsToFloorsMapping",
		"FloorToStructureMapping",
		"SpaceToItemMapping",
		"ItemToPropertyMapping",
	]

	for table in tables_list:
		query += "copy "+table+" from './import_csv/"+table+".csv' delimiter ',' csv;\n"

	return query


def main():
	read_json("../generate_json/buildings/")
	print(initSchema())
	print(copy_data())

if __name__ == "__main__":
	main()

